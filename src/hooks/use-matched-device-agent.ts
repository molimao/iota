import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "./use-auth";
import { getFleet } from "@/lib/fleet.functions";
import { getDeviceAgents } from "@/lib/device-agent.functions";

/** Shared owner-scoped caches; no new telemetry or Agent permissions. */
export function useMatchedDeviceAgent(deviceId?: string, miner?: string, preview = false) {
  const auth = useAuth();
  const list = useServerFn(getDeviceAgents),
    fleet = useServerFn(getFleet);
  const enabled = !preview && auth.ready && !!auth.userId;
  const devices = useQuery({
    queryKey: ["fleet", auth.userId],
    queryFn: () => fleet(),
    enabled: enabled && !deviceId,
    staleTime: 15000,
  });
  const query = useQuery({
    queryKey: ["device-agents", auth.userId],
    queryFn: () => list(),
    enabled,
    staleTime: 10000,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    retry: false,
  });
  const id =
    deviceId ??
    devices.data?.devices.find((d) =>
      d.bindings.some((b) => b.project === "iota" && b.identifier === miner),
    )?.id;
  return {
    enabled,
    query,
    devices: devices.data?.devices,
    agent: enabled ? query.data?.find((a) => a.deviceId === id) : undefined,
  };
}
