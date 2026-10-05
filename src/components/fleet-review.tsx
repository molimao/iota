import { useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { FleetWorkspace } from "./fleet-workspace";
import { reviewDevices, reviewReading } from "./fleet-review-data";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";
import { bindingIdentity, validBinding } from "@/lib/fleet";

export function FleetReview() {
  const membershipView = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("view") === "membership",
  });
  const [devices, setDevices] = useState(reviewDevices);
  const [plan, setPlan] = useState<"free" | "pro">("pro");
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  return (
    <>
      <div className="fleet-review-switch">
        <button className="fleet-outline" onClick={() => setPlan(plan === "pro" ? "free" : "pro")}>
          {plan === "pro" ? c.previewFree : c.previewPro}
        </button>
      </div>
      <FleetWorkspace
        initialTab={membershipView ? "plans" : "devices"}
        devices={devices}
        plan={plan}
        billing={{
          plan,
          quotaScope: "per_project",
          projectDeviceLimit: plan === "pro" ? 50 : 5,
          configured: false,
          status: plan === "pro" ? "active" : null,
          periodEnd: Date.now() + 30 * 86400000,
          cancelAtPeriodEnd: false,
          hasCustomer: false,
        }}
        preview
        reading={(binding) => {
          const data = reviewReading(binding);
          return binding.project === "xid"
            ? { ...data, totalLabel: c.balance }
            : binding.project === "flyai"
              ? { ...data, todayLabel: c.monthPoints, totalLabel: c.monthShare, note: c.apiLimited }
              : data;
        }}
        onMutation={async (mutation) => {
          const payload = mutation.payload;
          if (!("id" in payload)) return;
          if (mutation.action === "rename")
            setDevices((list) =>
              list.map((d) =>
                d.id === payload.id
                  ? { ...d, name: mutation.payload.name, hardware: mutation.payload.hardware }
                  : d,
              ),
            );
          if (mutation.action === "remove")
            setDevices((list) => list.filter((d) => d.id !== payload.id));
          if (mutation.action === "unlink")
            setDevices((list) =>
              list.map((d) =>
                d.id === payload.id
                  ? {
                      ...d,
                      bindings: d.bindings.filter((b) => b.id !== mutation.payload.bindingId),
                    }
                  : d,
              ),
            );
          if (mutation.action === "merge") {
            const source = devices.find((d) => d.id === mutation.payload.sourceId),
              target = devices.find((d) => d.id === payload.id);
            if (!source || !target || source.id === target.id) throw new Error(c.choose);
            if (source.bindings.length + target.bindings.length > 12)
              throw new Error(c.unavailable);
            setDevices((list) =>
              list
                .filter((d) => d.id !== source.id)
                .map((d) =>
                  d.id === target.id ? { ...d, bindings: [...d.bindings, ...source.bindings] } : d,
                ),
            );
          }
        }}
        onAdd={async (name, hardware, binding) => {
          if (!name) throw new Error(c.name);
          if (binding && !validBinding(binding.project, binding.identifier))
            throw new Error(c.invalidId);
          setDevices((list) => [
            ...list,
            {
              id: crypto.randomUUID(),
              name,
              hardware,
              bindings: binding ? [{ ...binding, id: crypto.randomUUID() }] : [],
              createdAt: Date.now(),
            },
          ]);
        }}
        onLink={async (deviceId, project, identifier, worker) => {
          if (!validBinding(project, identifier)) throw new Error(c.identifier);
          const binding = { id: crypto.randomUUID(), project, identifier, worker };
          if (
            devices
              .flatMap((d) => d.bindings)
              .some((b) => bindingIdentity(b) === bindingIdentity(binding))
          )
            throw new Error(c.linked);
          setDevices((list) =>
            list.map((d) => (d.id === deviceId ? { ...d, bindings: [...d.bindings, binding] } : d)),
          );
        }}
      />
    </>
  );
}
