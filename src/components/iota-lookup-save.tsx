import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWatchlist } from "@/hooks/use-watchlist";
import { trackFunnelEvent } from "@/lib/analytics";
import { authErrorText } from "@/lib/auth-errors";
import { onboardingCopy } from "@/lib/onboarding";
import { localized as l } from "@/lib/product-discovery";
import "./device-workspace.css";
import { shortId } from "@/lib/ss58";
import { useLocale } from "./site/locale";

const intentKey = "iota-lookup-save";
const copy = {
  signIn: l(["登录并保存", "登入並儲存", "Sign in and save", "로그인하고 저장", "ログインして保存"]),
  saving: l(["正在保存…", "正在儲存…", "Saving…", "저장 중…", "保存中…"]),
  saved: l(["已保存 · 查看设备", "已儲存 · 查看設備", "Saved · View devices", "저장됨 · 기기 보기", "保存済み・デバイスを見る"]),
  retrySave: l(["重试保存", "重試儲存", "Retry saving", "다시 저장", "保存を再試行"]),
  saveFailed: l(["设备没保存成功，Miner ID 已保留。", "設備未能儲存，Miner ID 已保留。", "The device wasn’t saved. Your Miner ID is still here.", "기기를 저장하지 못했습니다. 채굴기 ID는 그대로 유지됩니다.", "デバイスを保存できませんでした。Miner IDはそのままです。"]),
  retryDevices: l(["重新加载设备", "重新載入設備", "Reload devices", "기기 다시 불러오기", "デバイスを再読み込み"]),
  hint: l(["用 Google 登录后，会自动保存这个 Miner ID。", "用 Google 登入後，會自動儲存這個 Miner ID。", "Sign in with Google to save this Miner ID automatically.", "Google로 로그인하면 이 채굴기 ID가 자동으로 저장됩니다.", "Googleでログインすると、このMiner IDが自動で保存されます。"]),
  queue: l(["排队名次", "排隊名次", "Queue position", "대기 순번", "待機順位"]),
  unavailable: l(["公开 Miner ID 查不到个人排队名次。", "公開 Miner ID 查不到個人排隊名次。", "A public Miner ID does not reveal its queue position.", "공개 채굴기 ID로는 대기 순번을 확인할 수 없습니다.", "公開Miner IDだけでは待機順位を確認できません。"]),
  paste: l(["从日志查看名次", "從日誌查看名次", "Read position from a log", "로그에서 순번 확인", "ログから順位を確認"]),
  log: l(["粘贴 IOTA 排队日志，内容仅在当前页面处理。", "貼上 IOTA 排隊日誌，內容僅在目前頁面處理。", "Paste an IOTA queue log line. It stays on this page.", "IOTA 대기 로그를 붙여넣으세요. 이 페이지에서만 처리됩니다.", "IOTAの待機ログを貼り付けてください。このページ内で処理します。"]),
  noPosition: l(["这段日志没有排队名次。", "這段日誌沒有排隊名次。", "No queue position in this log.", "이 로그에 대기 순번이 없습니다.", "このログに待機順位がありません。"]),
  logPosition: l(["日志中的名次", "日誌中的名次", "Position in pasted log", "로그의 대기 순번", "ログの待機順位"]),
};

export function IotaLookupSave({ id, retry, preview = false }: {
  id: string;
  retry: React.ReactNode;
  preview?: boolean;
}) {
  const { locale } = useLocale();
  const auth = useAuth();
  const watch = useWatchlist(preview ? null : auth.userId, !preview && auth.ready);
  const [busy, setBusy] = useState(false);
  const [savedPreview, setSavedPreview] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const attempted = useRef<string | null>(null);
  const saved = preview ? savedPreview : !!auth.userId && watch.devices.some((d) => d.hotkey === id);
  const loadFailed = !preview && !!auth.userId && !watch.loaded && !!watch.storageError;

  async function save() {
    attempted.current = id;
    setBusy(true);
    setSaveError(undefined);
    trackFunnelEvent("lookup_save_start", { project: "iota" });
    const result = await watch.add({ hotkey: id, label: shortId(id) });
    trackFunnelEvent(result.ok ? "lookup_save_success" : "lookup_save_failed", { project: "iota" });
    if (!result.ok) setSaveError(result.error === watch.limitMessage ? result.error : copy.saveFailed[locale]);
    setBusy(false);
  }

  useEffect(() => {
    if (preview || !auth.userId || !watch.loaded) return;
    try {
      if (sessionStorage.getItem(intentKey) !== id) return;
      if (saved) sessionStorage.removeItem(intentKey);
    } catch {
      return;
    }
    if (!saved && attempted.current !== id) void save();
  }, [id, preview, auth.userId, watch.loaded, saved]);

  return <div className="lookup-save">
    <div className="lookup-actions">
      {saved ? (
        <a className="site-button" href={preview ? `/${locale}/review` : `/${locale}/devices`}>
          {copy.saved[locale]}
        </a>
      ) : (
        <button className="site-button" disabled={!preview && (!auth.ready || auth.signingIn || busy || (!!auth.userId && !watch.loaded && !loadFailed))} onClick={() => {
          if (preview) {
            setSavedPreview(true);
          } else if (loadFailed) {
            setBusy(true);
            void watch.reload().finally(() => setBusy(false));
          } else if (auth.userId) {
            void save();
          } else {
            try { sessionStorage.setItem(intentKey, id); } catch {}
            void auth.signInWithGoogle("iota_lookup");
          }
        }}>
          {loadFailed ? copy.retryDevices[locale] : busy ? copy.saving[locale] : saveError ? copy.retrySave[locale] : auth.userId && !preview ? onboardingCopy.save[locale] : copy.signIn[locale]}
        </button>
      )}
      {retry}
    </div>
    {!saved && !auth.userId && <p>{copy.hint[locale]}</p>}
    {!saved && !preview && (saveError || auth.error || (auth.userId && watch.storageError)) && (
      <p role="alert">{saveError ?? (auth.error ? authErrorText(auth.error, locale) : watch.storageError)}</p>
    )}
  </div>;
}


const sampleLog = "Successfully completed request to /miner/register/status/example; response: {'status': 'queued', 'position': 126}";

export function IotaLookupQueue({ preview }: { preview: boolean }) {
  const { locale } = useLocale();
  const [log, setLog] = useState(preview ? sampleLog : "");
  const lastResponse = log.split(/\r?\n/).filter((line) => line.includes("/miner/register/status/") && line.includes("response:")).at(-1);
  const body = lastResponse?.split("response:", 2)[1] ?? "";
  const position = /['"]status['"]\s*:\s*['"]queued['"]/.test(body)
    ? Number(body.match(/['"]position['"]\s*:\s*(\d+)/)?.[1]) : null;
  return <section className="lookup-queue">
    <strong>{copy.queue[locale]}</strong>
    <p>{copy.unavailable[locale]}</p>
    <details open={preview || undefined}>
      <summary>{copy.paste[locale]}</summary>
      <label>{copy.log[locale]}<textarea rows={3} maxLength={12000} value={log} onChange={(e) => setLog(e.target.value)} /></label>
      {log && <p role="status">{position !== null && Number.isInteger(position) && position <= 10000000 ? `${copy.logPosition[locale]} · #${position}` : copy.noPosition[locale]}</p>}
    </details>
  </section>;
}
