import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useBilling } from "@/hooks/use-billing";
import { adEligible, adLabels } from "@/lib/ads";
import { useLocale } from "./site/locale";

declare global {
  interface Window {
    adsbygoogle?: { push: (value: Record<string, unknown>) => unknown };
  }
}

/** Manual, content-only placement. No auto ads or timed refresh. */
export function SiteAd() {
  const auth = useAuth();
  const billing = useBilling(auth.userId, auth.ready);
  const { locale } = useLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [browserReady, setBrowserReady] = useState(false);
  const sent = useRef(false);
  const node = useRef<HTMLModElement>(null);
  useEffect(() => setBrowserReady(true), []);
  const client = import.meta.env["VITE_ADSENSE_CLIENT"] || "";
  const slot = import.meta.env["VITE_ADSENSE_CONTENT_SLOT"] || "";
  const eligible =
    browserReady &&
    adEligible({
      enabled: import.meta.env["VITE_ADSENSE_ENABLED"] === "true",
      hostname: window.location.hostname,
      pathname,
      client,
      slot,
      authReady: auth.ready,
      userId: auth.userId,
      billingReady: billing.isSuccess && !billing.isError,
      billing: billing.data,
      privacyBlocked:
        navigator.doNotTrack === "1" ||
        !!(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl,
    });
  useEffect(() => {
    // Remove the third-party runtime completely after an account change/upgrade.
    if (sent.current && auth.userId && (!billing.isSuccess || billing.data?.plan === "pro")) {
      window.location.reload();
      return;
    }
    if (!eligible || !node.current || sent.current) return;
    let canceled = false;
    const request = () => {
      if (canceled || !node.current || sent.current) return;
      try {
        window.adsbygoogle ||= [] as Record<string, unknown>[];
        window.adsbygoogle.push({});
        sent.current = true;
      } catch {
        /* Ad blockers must not affect the product. */
      }
    };
    let script = document.querySelector<HTMLScriptElement>("script[data-iota-ads]");
    if (!script) {
      script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset["iotaAds"] = "true";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.addEventListener("load", request, { once: true });
      document.head.appendChild(script);
    } else request();
    return () => {
      canceled = true;
      script?.removeEventListener("load", request);
    };
  }, [eligible, client, auth.userId, billing.isSuccess, billing.data?.plan]);
  if (!eligible) return null;
  return (
    <aside className="site-content-ad" aria-label={adLabels[locale][0]}>
      <small>{adLabels[locale][0]}</small>
      <ins
        ref={node}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
