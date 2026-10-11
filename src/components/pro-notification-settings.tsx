import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getProPreferences, saveProPreferences } from "@/lib/pro-tools.functions";
import type { ProPreferences } from "@/lib/pro-tools";
import { LOCALES, LANGUAGE_NAME, type SiteLocale } from "@/lib/site";
import { useLocale } from "./site/locale";
import { proCopy as c } from "./pro-tools-copy";
export function ProNotificationControls({
  value,
  busy,
  error,
  onSave,
}: {
  value: ProPreferences | null;
  busy: boolean;
  error: boolean;
  onSave: (v: { alerts: boolean; monthly: boolean; locale: SiteLocale }) => Promise<void>;
}) {
  const { locale } = useLocale();
  const [saved, setSaved] = useState(false);
  async function change(v: { alerts: boolean; monthly: boolean; locale: SiteLocale }) {
    setSaved(false);
    await onSave(v);
    setSaved(true);
  }
  return (
    <section className="pro-notification-settings" id="pro-notifications">
      <h3>
        {c.more[locale]} <small>PRO</small>
      </h3>
      {value ? (
        <>
          <label className="pro-setting-row">
            <span>
              <b>{c.alerts[locale]}</b>
            </span>
            <input
              type="checkbox"
              checked={value.alerts}
              disabled={busy || !value.eligible || !value.configured}
              onChange={(e) => void change({ ...value, alerts: e.target.checked })}
            />
          </label>
          <label className="pro-setting-row">
            <span>
              <b>{c.monthly[locale]}</b>
              <small>{c.monthlyNote[locale]}</small>
            </span>
            <input
              type="checkbox"
              checked={value.monthly}
              disabled={busy || !value.eligible || !value.configured}
              onChange={(e) => void change({ ...value, monthly: e.target.checked })}
            />
          </label>
          <details className="pro-data-table">
            <summary>{c.rules[locale]}</summary>
            <p className="pro-tools-note">{c.alertsNote[locale]}</p>
          </details>
          <p className="pro-tools-note">
            {c.recipient[locale]} · {value.recipient ?? "—"}
          </p>
          <label className="pro-language">
            {c.language[locale]}
            <select
              value={value.locale}
              disabled={busy || !value.eligible || !value.configured}
              onChange={(e) => void change({ ...value, locale: e.target.value as SiteLocale })}
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_NAME[l]}
                </option>
              ))}
            </select>
          </label>
          {!value.eligible && <p className="pro-tools-note">{c.locked[locale]}</p>}
          {!value.configured && value.eligible && <p role="status">{c.unavailable[locale]}</p>}
        </>
      ) : (
        <p role="status">{c.unavailable[locale]}</p>
      )}
      {saved && !error && <p role="status">{c.saved[locale]}</p>}
      {error && <p role="alert">{c.unavailable[locale]}</p>}
    </section>
  );
}
export function ProNotificationSettings({ userId }: { userId: string | null }) {
  const read = useServerFn(getProPreferences),
    save = useServerFn(saveProPreferences),
    client = useQueryClient();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const q = useQuery({
    queryKey: ["pro-notifications", userId],
    enabled: !!userId,
    queryFn: () => read(),
    staleTime: 30000,
    retry: 1,
  });
  return (
    <ProNotificationControls
      value={q.data ?? null}
      busy={busy}
      error={error || q.isError}
      onSave={async (v) => {
        setBusy(true);
        setError(false);
        try {
          await save({ data: v });
          await client.invalidateQueries({ queryKey: ["pro-notifications", userId] });
        } catch {
          setError(true);
        } finally {
          setBusy(false);
        }
      }}
    />
  );
}
