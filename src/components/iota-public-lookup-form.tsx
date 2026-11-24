import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { trackFunnelEvent } from "@/lib/analytics";
import { onboardingCopy } from "@/lib/onboarding";
import { minerIdError } from "@/lib/ss58";
import { localizeMessage, useLocale } from "./site/locale";
import { localizeValue } from "./site/localization";

export function IotaPublicLookupForm() {
  const { locale, en } = useLocale();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="start-form"
      onSubmit={(event) => {
        event.preventDefault();
        const id = value.trim();
        const reason = minerIdError(id);
        if (reason) {
          setError(localizeMessage(reason, locale));
          return;
        }
        trackFunnelEvent("lookup_query_start", { project: "iota" });
        window.location.href = `/${locale}/app?lookup=${encodeURIComponent(id)}`;
      }}
    >
      <label>
        <span className="sr-only">Miner ID</span>
        <input
          value={value}
          maxLength={64}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          placeholder={localizeValue(
            en ? "Paste your public Miner ID" : "粘贴你的公开 Miner ID",
            locale,
          )}
          aria-invalid={error ? true : undefined}
        />
      </label>
      <button className="site-button" type="submit">
        {onboardingCopy.lookup[locale]}
        <ArrowUpRight size={19} aria-hidden="true" />
      </button>
      <small className="start-lookup-scope">{onboardingCopy.lookupScope[locale]}</small>
      {error ? (
        <p className="start-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
