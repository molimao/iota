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
  const upgradeProject = FLEET_PROJECTS.find((p) => p === upgrade);
  const message = (e: unknown) =>
    e instanceof Error && e.message === "project_device_limit_reached"
      ? c.limit
      : e instanceof Error && e.message === "import_partial"
        ? c.importPartial
        : c.unavailable;
  async function subscribe(interval: "month" | "year") {
    if (!auth.userId) {
      await auth.signInWithGoogle();
      return;
    }
    if (!fleet.billing?.configured) throw new Error(c.previewBilling);
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
  return (
    <>
      <div className="fleet-account-bar">
        <span>{auth.userId ? c.savedAccount : c.savedLocal}</span>
        {!auth.userId && (
          <button
            className="fleet-outline"
            onClick={() => void auth.signInWithGoogle()}
            disabled={auth.signingIn}
          >
            {c.signIn}
          </button>
        )}
        {fleet.pendingLocal > 0 && (
          <button
            className="fleet-outline"
            disabled={!fleet.ready}
            onClick={() => void fleet.importLocal().catch((e) => setError(message(e)))}
          >
            {c.importLocal} · {fleet.pendingLocal}
          </button>
        )}
        {fleet.billing?.hasCustomer && (
          <button className="fleet-outline" onClick={() => void manage()}>
            {c.manage}
          </button>
        )}
        {!fleet.ready && <span role="status">{c.checking}</span>}
        {billingResult === "success" && fleet.plan !== "pro" && (
          <span role="status">{c.paymentPending}</span>
        )}
      </div>
      <FleetWorkspace
        devices={fleet.devices}
        plan={fleet.plan}
        initialPaywallProject={upgradeProject}
        reading={reading}
        onAdd={async (name, hardware) => {
          try {
            await fleet.mutate({ action: "create", payload: { name, hardware } });
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
