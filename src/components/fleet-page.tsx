import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { useFleetReadings } from "@/hooks/use-fleet-readings";
import { startCheckout, openBillingPortal } from "@/lib/billing.functions";
import { FLEET_PROJECTS } from "@/lib/fleet";
import { FleetWorkspace } from "./fleet-workspace";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";

export function FleetPage() {
  const { locale } = useLocale(),
    c = fleetCopy(locale),
    auth = useAuth();
  const fleet = useFleet(auth.userId, auth.ready),
    reading = useFleetReadings(fleet.devices, fleet.ready);
  const checkoutFn = useServerFn(startCheckout),
    portalFn = useServerFn(openBillingPortal);
  const [error, setError] = useState<string | null>(null);
  const billingResult = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("billing"),
  });
  const upgrade = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("upgrade"),
  });
  const projectFilter = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("project"),
  });
  const initialProject = FLEET_PROJECTS.find((p) => p === projectFilter);
  const upgradeProject = FLEET_PROJECTS.find((p) => p === upgrade);
  const memberView = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("view") === "membership",
  });
  const message = (e: unknown) =>
    e instanceof Error && e.message === "project_device_limit_reached"
      ? c.limit
      : e instanceof Error && e.message === "invalid_binding"
        ? c.invalidId
        : e instanceof Error && e.message === "duplicate_binding"
          ? c.duplicate
          : e instanceof Error && e.message === "import_partial"
            ? c.importPartial
            : c.unavailable;
  async function subscribe(interval: "month" | "year") {
    if (!auth.userId) {
      await auth.signInWithGoogle();
      return;
    }
    if (!fleet.billing?.configured) throw new Error(c.unavailable);
    try {
      const result = await checkoutFn({ data: { interval, locale } });
      window.location.assign(result.url);
    } catch (e) {
      throw new Error(message(e));
    }
  }
  async function manage() {
    try {
      const result = await portalFn({ data: { locale } });
      window.location.assign(result.url);
    } catch (e) {
      setError(message(e));
    }
  }
  if (!fleet.ready)
    return (
      <main className="fleet-workspace">
        <h1>{c.title}</h1>
        <p role={fleet.error ? "alert" : "status"}>{fleet.error ? c.unavailable : c.checking}</p>
        {fleet.error && (
          <button className="site-button" onClick={() => void fleet.reload()}>
            {c.retry}
          </button>
        )}
      </main>
    );
  return (
    <>
      {(fleet.pendingLocal > 0 || billingResult === "success") && (
        <div className="fleet-account-bar" role="status">
          {fleet.pendingLocal > 0 && (
            <button
              className="fleet-outline"
              disabled={!fleet.ready}
              onClick={() => void fleet.importLocal().catch((e) => setError(message(e)))}
            >
              {c.importLocal} · {fleet.pendingLocal}
            </button>
          )}
          {billingResult === "success" && (
            <span>{fleet.plan === "pro" ? c.paymentConfirmed : c.paymentPending}</span>
          )}
        </div>
      )}
      <FleetWorkspace
        initialProject={initialProject}
        devices={fleet.devices}
        plan={fleet.plan}
        billing={fleet.billing}
        initialTab={memberView ? "plans" : "devices"}
        initialPaywallProject={upgradeProject}
        reading={reading}
        onAdd={async (name, hardware, binding) => {
          try {
            await fleet.mutate({
              action: "create",
              payload: { name, hardware, ...(binding ? { binding } : {}) },
            });
          } catch (e) {
            throw new Error(message(e));
          }
        }}
        onLink={async (id, project, identifier, worker) => {
          try {
            await fleet.mutate({
              action: "link",
              payload: { id, binding: { project, identifier, worker } },
            });
          } catch (e) {
            throw new Error(message(e));
          }
        }}
        onSubscribe={subscribe}
        onManage={manage}
        onMutation={async (mutation) => {
          try {
            await fleet.mutate(mutation);
          } catch (e) {
            throw new Error(message(e));
          }
        }}
        error={error ?? (fleet.error ? c.unavailable : null)}
      />
    </>
  );
}
