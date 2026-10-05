import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  FLEET_KEY,
  bindingIdentity,
  canLinkProject,
  projectQuotaState,
  type FleetDevice,
} from "@/lib/fleet";
import { getFleet, mutateFleet, type FleetMutation } from "@/lib/fleet.functions";
import { useBilling } from "./use-billing";
import { loadLocalFleet, localFleetMutation } from "@/lib/fleet-storage";

export function useFleet(userId: string | null, authReady: boolean) {
  const client = useQueryClient(),
    readFn = useServerFn(getFleet),
    mutateFn = useServerFn(mutateFleet);
  const [local, setLocal] = useState<FleetDevice[]>([]),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState<string | null>(null);
  const key = ["fleet", userId] as const;
  useEffect(() => {
    if (!authReady) return;
    try {
      setLocal(loadLocalFleet());
      setError(null);
    } catch {
      setError("local_read_failed");
    }
    setLoaded(true);
  }, [authReady, userId]);
  useEffect(() => {
    const reload = () => {
      try {
        setLocal(loadLocalFleet());
      } catch {
        setError("local_read_failed");
      }
    };
    const storage = (event: StorageEvent) => {
      if (event.key === FLEET_KEY) reload();
    };
    window.addEventListener("storage", storage);
    window.addEventListener("watch-fleet-updated", reload);
    window.addEventListener("focus", reload);
    return () => {
      window.removeEventListener("storage", storage);
      window.removeEventListener("watch-fleet-updated", reload);
      window.removeEventListener("focus", reload);
    };
  }, []);
  const billing = useBilling(userId, authReady);
  const remote = useQuery({
    queryKey: key,
    queryFn: () => readFn(),
    enabled: authReady && !!userId,
    staleTime: 15000,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
  useEffect(() => {
    if (userId && billing.data) void client.invalidateQueries({ queryKey: ["fleet", userId] });
  }, [userId, billing.data?.plan, client]);
  const devices = userId ? (remote.data?.devices ?? []) : local;
  const mutate = useCallback(
    async (input: FleetMutation) => {
      if (userId) {
        const result = await mutateFn({ data: input });
        client.setQueryData(["fleet", userId], result);
      } else {
        const next = localFleetMutation(loadLocalFleet(), input);
        localStorage.setItem(FLEET_KEY, JSON.stringify(next));
        setLocal(next);
        window.dispatchEvent(new Event("watch-fleet-updated"));
      }
      setError(null);
    },
    [userId, client, mutateFn],
  );
  const importLocal = useCallback(async () => {
    if (!userId || !remote.data) throw new Error("sign_in_required");
    let snapshot = remote.data,
      skipped = 0;
    for (const device of local) {
      const bindings = device.bindings.filter(
        (b) =>
          !snapshot.devices
            .flatMap((d) => d.bindings)
            .some((saved) => bindingIdentity(b) === bindingIdentity(saved)),
      );
      if (!bindings.length) continue;
      // Retry an explicit import using an identical public source, never a name.
      const linked = snapshot.devices.filter((d) =>
        d.bindings.some((b) =>
          device.bindings.some((local) => bindingIdentity(local) === bindingIdentity(b)),
        ),
      );
      if (linked.length > 1) {
        skipped += bindings.length;
        continue;
      }
      let target = linked[0]?.id;
      for (const binding of bindings) {
        try {
          if (target) {
            if (
              !canLinkProject(
                snapshot.devices,
                target,
                binding.project,
                snapshot.projectDeviceLimit,
              )
            ) {
              skipped++;
              continue;
            }
            snapshot = await mutateFn({
              data: { action: "link", payload: { id: target, binding } },
            });
          } else {
            if (
              !projectQuotaState(snapshot.devices, binding.project, snapshot.projectDeviceLimit)
                .canAdd
            ) {
              skipped++;
              continue;
            }
            const before = new Set(snapshot.devices.map((d) => d.id));
            snapshot = await mutateFn({
              data: {
                action: "create",
                payload: { name: device.name, hardware: device.hardware, binding },
              },
            });
            target = snapshot.devices.find((d) => !before.has(d.id))?.id;
          }
        } catch {
          skipped++;
        }
      }
      client.setQueryData(["fleet", userId], snapshot);
    }
    if (skipped) throw new Error("import_partial");
  }, [userId, remote.data, local, mutateFn, client]);
  const imported = new Set(devices.flatMap((d) => d.bindings).map(bindingIdentity));
  const pendingLocal = userId
    ? local.filter((d) => d.bindings.some((b) => !imported.has(bindingIdentity(b)))).length
    : 0;
  return {
    devices,
    plan: remote.data?.plan ?? "free",
    limit: remote.data?.projectDeviceLimit ?? 5,
    ready: authReady && (userId ? !!remote.data : loaded),
    error: error ?? (remote.isError ? "fleet_read_failed" : null),
    billing: billing.data,
    pendingLocal,
    mutate,
    importLocal,
    reload: () => remote.refetch(),
  };
}
