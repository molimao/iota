import { DeviceEarningsTrend } from "./device-earnings-trend";
import { ProTools } from "./pro-tools";
import { ProNotificationSettings } from "./pro-notification-settings";
import { useState, useEffect, useRef, useCallback } from "react";
import { CHECKOUT_INTENT_KEY, checkoutInterval, readCheckoutIntent } from "@/lib/checkout-intent";
import { DailyReportSettings } from "./daily-report-settings";
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
  const { userId, signInWithGoogle } = auth;
  const checkoutBusy = useRef(false);
  const cadence = useRouterState({
    select: (s) => checkoutInterval(new URLSearchParams(s.location.searchStr).get("checkout")),
  });
  const clearIntent = useCallback(() => {
    try {
      sessionStorage.removeItem(CHECKOUT_INTENT_KEY);
    } catch {
      /* Storage may be blocked. */
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    window.history.replaceState(window.history.state, "", url.href);
  }, []);
  const subscribe = useCallback(
    async (interval: "month" | "year") => {
      if (checkoutBusy.current) return;
      checkoutBusy.current = true;
      setError(null);
      try {
        if (!userId) {
          const url = new URL(window.location.href);
          url.searchParams.set("checkout", interval);
          window.history.replaceState(window.history.state, "", url.href);
          try {
            sessionStorage.setItem(
              CHECKOUT_INTENT_KEY,
              JSON.stringify({
                interval,
                at: Date.now(),
                path: url.pathname,
              }),
            );
          } catch {
            /* The selected interval still survives in the return URL. */
          }
          await signInWithGoogle();
          return;
        }
        // Checkout validates live billing configuration on the server.
        clearIntent();
        const result = await checkoutFn({ data: { interval, locale } });
        window.location.assign(result.url);
      } catch {
        clearIntent();
        throw new Error(c.unavailable);
      } finally {
        checkoutBusy.current = false;
      }
    },
    [userId, signInWithGoogle, checkoutFn, locale, c.unavailable, clearIntent],
  );
  useEffect(() => {
    if (auth.error) {
      clearIntent();
      return;
    }
    if (!auth.ready || !auth.userId || !fleet.ready || !fleet.billing) return;
    let pending: "month" | "year" | null = null;
    try {
      pending = readCheckoutIntent(
        sessionStorage.getItem(CHECKOUT_INTENT_KEY),
        window.location.href,
      );
    } catch {
      /* Never auto-start without a saved intent. */
    }
    clearIntent(); // Consume before the request, including Strict Mode or a remount.
    if (pending) void subscribe(pending).catch((e) => setError(e.message));
  }, [auth.ready, auth.userId, auth.error, fleet.ready, fleet.billing, subscribe, clearIntent]);
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
        initialInterval={cadence}
        signedIn={!!auth.userId}
        initialProject={initialProject}
        devices={fleet.devices}
        plan={fleet.plan}
        billing={fleet.billing}
        reportSettings={
          <>
            <DailyReportSettings userId={auth.userId} />
            {fleet.plan === "pro" && <ProNotificationSettings userId={auth.userId} />}
          </>
        }
        deviceTrend={(device) => (
          <DeviceEarningsTrend userId={auth.userId} device={device} plan={fleet.plan} />
        )}
        proTools={<ProTools userId={auth.userId} plan={fleet.plan} devices={fleet.devices} />}
        initialTab={memberView ? "plans" : "devices"}
        initialPaywallProject={upgradeProject}
        reading={reading}
        onRefresh={reading.refresh}
        refreshing={reading.refreshing}
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
