import { useState } from "react";
import { Cloud, ArrowRight, LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { useLocale } from "./site/locale";
import { authErrorText } from "@/lib/auth-errors";

const copy = {
  zh: {
    title: "换台设备，也能接着看",
    body: "当前清单只保存在这台浏览器。登录后可同步到账号，在手机和其他电脑查看。",
    login: "登录并同步",
    pending: "浏览器里还有未同步的设备",
    import: "同步到我的账号",
    note: "合并到账号清单，重复项目地址会自动跳过。",
    synced: "已同步到账号，换台设备登录即可查看。",
    failed: "部分设备未能同步，请检查项目名额后重试。",
  },
  "zh-TW": {
    title: "換台裝置，也能接著看",
    body: "目前清單只儲存在這個瀏覽器。登入後可同步至帳號，在手機和其他電腦查看。",
    login: "登入並同步",
    pending: "瀏覽器中還有未同步的裝置",
    import: "同步至我的帳號",
    note: "合併至帳號清單，重複專案地址會自動略過。",
    synced: "已同步至帳號，換台裝置登入即可查看。",
    failed: "部分裝置未能同步，請檢查專案名額後重試。",
  },
  en: {
    title: "Pick up on another device",
    body: "This list is saved only in this browser. Sign in to sync it to your account and check it on your phone or another computer.",
    login: "Sign in to sync",
    pending: "Some browser devices aren’t synced yet",
    import: "Sync to my account",
    note: "Merge into your account. Duplicate project addresses are skipped.",
    synced: "Synced to your account. Sign in on another device to see your list.",
    failed: "Some devices could not be synced. Check project limits and try again.",
  },
  ja: {
    title: "別の端末でも続けて確認",
    body: "この一覧は現在のブラウザーにのみ保存されています。ログインするとアカウントに同期し、スマートフォンや別のパソコンでも確認できます。",
    login: "ログインして同期",
    pending: "未同期の端末がブラウザーにあります",
    import: "アカウントに同期",
    note: "アカウントの一覧に統合します。重複するプロジェクトアドレスは除外されます。",
    synced: "アカウントに同期済みです。別の端末でもログインして確認できます。",
    failed: "一部の端末を同期できませんでした。プロジェクトの上限を確認して再試行してください。",
  },
  ko: {
    title: "다른 기기에서도 이어서 확인",
    body: "목록은 현재 브라우저에만 저장됩니다. 로그인하면 계정에 동기화하여 휴대폰이나 다른 컴퓨터에서도 볼 수 있습니다.",
    login: "로그인하여 동기화",
    pending: "아직 동기화하지 않은 기기가 있습니다",
    import: "내 계정에 동기화",
    note: "계정 목록에 병합합니다. 중복 프로젝트 주소는 건너뜁니다.",
    synced: "계정에 동기화되었습니다. 다른 기기에서도 로그인해 확인하세요.",
    failed: "일부 기기를 동기화하지 못했습니다. 프로젝트 한도를 확인하고 다시 시도하세요.",
  },
};
export function SyncGuidance({
  compact = false,
  informational = false,
}: {
  compact?: boolean;
  informational?: boolean;
}) {
  const { locale } = useLocale(),
    c = copy[locale],
    auth = useAuth();
  const fleet = useFleet(auth.userId, auth.ready);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [synced, setSynced] = useState(false);
  if (!auth.ready || (auth.userId && !fleet.ready)) return null;
  const pending = fleet.pendingLocal > 0;
  if (auth.userId && !pending)
    return compact || synced ? (
      <p className="sync-saved" role="status">
        <Cloud size={15} />
        {c.synced}
      </p>
    ) : null;
  async function sync() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await fleet.importLocal();
      setSynced(true);
    } catch {
      setError(c.failed);
    } finally {
      setBusy(false);
    }
  }
  return (
    <aside className={`sync-guidance${compact ? " compact" : ""}`}>
      <Cloud size={20} aria-hidden="true" />
      <div>
        <strong>{pending ? `${c.pending} · ${fleet.pendingLocal}` : c.title}</strong>
        <p>{pending ? c.note : c.body}</p>
        {(error || auth.error) && <p role="alert">{error || authErrorText(auth.error!, locale)}</p>}
      </div>
      {!informational && (
        <button
          type="button"
          className="fleet-outline"
          disabled={busy || auth.signingIn}
          onClick={() => (pending ? void sync() : void auth.signInWithGoogle())}
        >
          {busy || auth.signingIn ? <LoaderCircle size={15} className="animate-spin" /> : null}
          {pending ? c.import : c.login}
          <ArrowRight size={15} />
        </button>
      )}
    </aside>
  );
}
