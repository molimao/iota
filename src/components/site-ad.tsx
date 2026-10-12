import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useBilling } from "@/hooks/use-billing";
import { adEligible } from "@/lib/ads";

/** Google places Auto ads; membership is checked before loading any ad runtime. */
export function SiteAd() {
  const auth = useAuth();
  const billing = useBilling(auth.userId, auth.ready);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const loaded = useRef(false);
  const loadedUser = useRef<string | null>(null);
  useEffect(() => {
    const client = import.meta.env["VITE_ADSENSE_CLIENT"] || "";
    const eligible = adEligible({
      enabled: import.meta.env["VITE_ADSENSE_ENABLED"] === "true",
      hostname: window.location.hostname,
      pathname,
      client,
      authReady: auth.ready,
      userId: auth.userId,
      billingReady: billing.isSuccess && !billing.isError,
      billing: billing.data,
      privacyBlocked:
        navigator.doNotTrack === "1" ||
        !!(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl,
    });
    // Removing the script alone cannot stop already-running Auto ads.
    // A fresh document ensures login, upgrade and error states start without ads.
    if (loaded.current && (!eligible || loadedUser.current !== auth.userId)) {
      window.location.reload();
      return;
    }
    if (!eligible || loaded.current) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset["iotaAds"] = "true";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    loaded.current = true;
    loadedUser.current = auth.userId;
    document.head.appendChild(script);
  }, [pathname, auth.ready, auth.userId, billing.isSuccess, billing.isError, billing.data]);
  return null;
}
