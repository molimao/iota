import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, ArrowUpRight } from "lucide-react";
import { getReportPreferences, setReportPreferences } from "@/lib/daily-report.functions";
import { LANGUAGE_NAME, LOCALES, isLocale, type SiteLocale } from "@/lib/site";
import { useLocale } from "./site/locale";
import { reportCopy as c } from "./daily-report-copy";
import { ReportEmailPreview } from "./daily-report-preview";

type Preference = {
  enabled: boolean;
  recipient: string | null;
  eligible: boolean;
  emailChanged: boolean;
  configured: boolean;
  locale: SiteLocale;
  nextAt: number;
  lastSentAt: string | null;
};
export function ReportSettings({
  value,
  busy,
  error,
  onSave,
}: {
  value: Preference | null;
  busy: boolean;
  error: boolean;
  onSave: (enabled: boolean, locale: SiteLocale) => Promise<void>;
}) {
  const { locale } = useLocale(),
    [preview, setPreview] = useState(false);
  return (
    <section id="daily-reports" className="daily-report-settings">
      <header>
        <span className="daily-report-icon">
          <Mail size={21} />
        </span>
        <div>
          <h2>
            {c.title[locale]} <small>PRO</small>
          </h2>
          <p>{c.schedule[locale]}</p>
        </div>
        <button className="text-link" onClick={() => setPreview(true)}>
          {c.preview[locale]} <ArrowUpRight size={13} />
        </button>
      </header>
      <p className="daily-report-intro">{c.intro[locale]}</p>
      {value && !value.eligible && !value.enabled ? (
        <div className="daily-report-unlock">
          <div>
            <b>{c.included[locale]}</b>
            <p>{c.afterPayment[locale]}</p>
          </div>
          <a className="site-button" href="#pro-plan">
            {c.viewPro[locale]} <ArrowUpRight size={14} />
          </a>
        </div>
      ) : (
        <>
          <div className="daily-report-control">
            <div>
              <span>{c.recipient[locale]}</span>
              <strong>{value?.recipient ?? "—"}</strong>
            </div>
            <label className="daily-report-toggle">
              <input
                type="checkbox"
                checked={!!value?.enabled && !value.emailChanged}
                disabled={
                  busy ||
                  !value ||
                  ((!value.enabled || value.emailChanged) && (!value.eligible || !value.configured))
                }
                onChange={(e) => void onSave(e.target.checked, value?.locale ?? locale)}
              />
              <span>
                {busy
                  ? c.saving[locale]
                  : value?.enabled && !value.emailChanged
                    ? c.subscribed[locale]
                    : c.enable[locale]}
              </span>
            </label>
          </div>
          <div className="daily-report-language">
            <label>
              {c.language[locale]}{" "}
              <select
                value={value?.locale ?? locale}
                disabled={busy || !value?.eligible || !value.configured || value.emailChanged}
                onChange={(e) => {
                  if (isLocale(e.target.value)) void onSave(!!value?.enabled, e.target.value);
                }}
              >
                {LOCALES.map((l) => (
                  <option key={l} value={l}>
                    {LANGUAGE_NAME[l]}
                  </option>
                ))}
              </select>
            </label>
            {value?.enabled && value.eligible && !value.emailChanged && (
              <span>
                {c.next[locale]} ·{" "}
                {new Intl.DateTimeFormat(locale, {
                  timeZone: "Asia/Shanghai",
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(value.nextAt)}
              </span>
            )}
          </div>
          {value?.enabled && value.emailChanged && (
            <button
              className="text-link"
              disabled={busy}
              onClick={() => void onSave(false, value.locale)}
            >
              {c.unsubscribe[locale]}
            </button>
          )}
        </>
      )}
      {error && (
        <p className="daily-report-error" role="alert">
          {c.failed[locale]}
        </p>
      )}
      <p className="daily-report-note">
        {value?.emailChanged
          ? c.emailChanged[locale]
          : value && !value.eligible
            ? value.enabled
              ? c.inactive[locale]
              : c.pro[locale]
            : !value?.configured
              ? c.setup[locale]
              : c.first[locale]}
      </p>
      <ReportEmailPreview open={preview} onOpenChange={setPreview} />
    </section>
  );
}
export function DailyReportSettings({ userId }: { userId: string | null }) {
  const { locale } = useLocale(),
    read = useServerFn(getReportPreferences),
    save = useServerFn(setReportPreferences),
    client = useQueryClient();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const key = ["daily-report-preference", userId];
  const q = useQuery({
    queryKey: key,
    queryFn: () => read(),
    enabled: !!userId,
    staleTime: 15000,
    refetchInterval: 30000,
    retry: 1,
  });
  const p = q.data;
  const value = p
    ? {
        ...p,
        locale: isLocale(typeof p.locale === "string" ? p.locale : undefined)
          ? (p.locale as SiteLocale)
          : locale,
      }
    : !userId
      ? {
          enabled: false,
          recipient: null,
          eligible: false,
          emailChanged: false,
          configured: false,
          locale,
          nextAt: 0,
          lastSentAt: null,
        }
      : null;
  async function update(enabled: boolean, l: SiteLocale) {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      await save({ data: { enabled, locale: l } });
      await client.invalidateQueries({ queryKey: key });
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <ReportSettings
      value={value}
      busy={busy || (!!userId && q.isPending)}
      error={error || q.isError}
      onSave={update}
    />
  );
}
