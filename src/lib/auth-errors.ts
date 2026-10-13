import type { SiteLocale } from "./site";
export type AuthIssue = "login_expired" | "login_unavailable" | "login_canceled" | "login_failed";
/** Only classify known signals; never display arbitrary callback text or session values. */
export function authCallbackIssue(hash: string, search = ""): AuthIssue | null {
  const h = new URLSearchParams(hash.replace(/^#/, "")),
    q = new URLSearchParams(search.replace(/^\?/, ""));
  const p = h.has("error") ? h : q;
  if (!p.has("error")) return null;
  const code = p.get("error");
  if (code === "access_denied") return "login_canceled";
  if (code === "server_error") return "login_unavailable";
  if (code === "invalid_request" && /csrf|expired/i.test(p.get("error_description") ?? ""))
    return "login_expired";
  return "login_failed";
}
/** A retry must not carry an earlier OAuth error into the new return URL. */
export function authReturnUrl(href: string) {
  const u = new URL(href);
  const h = new URLSearchParams(u.hash.slice(1));
  if (h.has("error")) u.hash = "";
  if (u.searchParams.has("error"))
    for (const key of ["error", "error_description", "error_code", "state"])
      u.searchParams.delete(key);
  return u.href;
}
const messages = {
  login_expired: {
    zh: "登录已过期，请重新登录。",
    "zh-TW": "登入已過期，請重新登入。",
    en: "Sign-in expired. Please try again.",
    ko: "로그인이 만료되었습니다. 다시 로그인하세요.",
    ja: "ログインの有効期限が切れました。再度お試しください。",
  },
  login_unavailable: {
    zh: "登录服务暂不可用，请稍后重试。",
    "zh-TW": "登入服務暫時無法使用，請稍後再試。",
    en: "Sign-in is temporarily unavailable. Try again later.",
    ko: "로그인 서비스를 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도하세요.",
    ja: "ログインサービスを一時的に利用できません。しばらくしてからお試しください。",
  },
  login_canceled: {
    zh: "登录已取消。",
    "zh-TW": "登入已取消。",
    en: "Sign-in canceled.",
    ko: "로그인이 취소되었습니다.",
    ja: "ログインをキャンセルしました。",
  },
  login_failed: {
    zh: "登录未完成，请重试。",
    "zh-TW": "登入未完成，請重試。",
    en: "Sign-in was not completed. Please try again.",
    ko: "로그인이 완료되지 않았습니다. 다시 시도하세요.",
    ja: "ログインが完了しませんでした。再度お試しください。",
  },
} as const;
export function authErrorText(code: string, locale: SiteLocale) {
  return messages[code in messages ? (code as AuthIssue) : "login_failed"][locale];
}
