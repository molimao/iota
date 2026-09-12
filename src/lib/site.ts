export const CANONICAL_HOST = "iotahome.site";
export const ORIGIN = `https://${CANONICAL_HOST}`;
export const LOCALES = ["zh", "en"] as const;
export type SiteLocale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "iota-locale";

export function isLocale(value: string | undefined): value is SiteLocale {
  return value === "en" || value === "zh";
}

export function detectLocaleFromRequest(request: Request): SiteLocale {
  const cookie = request.headers.get("cookie") ?? "";
  const saved = cookie.match(/(?:^|;\s*)iota-locale=(en|zh)/);
  if (saved) return saved[1] as SiteLocale;

  const accept = request.headers.get("accept-language") ?? "";
  const parts = accept.split(",").map((part) => {
    const [tag, q] = part.trim().split(";q=");
    return { tag: (tag ?? "").toLowerCase(), q: q ? Number(q) : 1 };
  });
  parts.sort((a, b) => b.q - a.q);
  for (const { tag } of parts) {
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("en")) return "en";
  }
  return "zh";
}

export function detectLocaleOnClient(): SiteLocale {
  if (typeof document !== "undefined") {
    const cookie = document.cookie.match(/(?:^|;\s*)iota-locale=(en|zh)/);
    if (cookie) return cookie[1] as SiteLocale;
    try {
      const stored = localStorage.getItem(LOCALE_COOKIE) ?? undefined;
      if (isLocale(stored)) return stored;
    } catch {
      /* private mode */
    }
    if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("zh")) {
      return "zh";
    }
    if (typeof navigator !== "undefined" && navigator.language) return "en";
  }
  return "zh";
}

export function persistLocale(locale: SiteLocale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    /* ignore quota / private mode */
  }
}

export function sitePath(locale: string, page = "") {
  const suffix = !page || page === "home" ? "" : `/${page}`;
  return `/${locale}${suffix}`;
}

function envOrigin() {
  const raw =
    (typeof import.meta !== "undefined" &&
      (import.meta.env as { VITE_SITE_ORIGIN?: string }).VITE_SITE_ORIGIN) ||
    (typeof process !== "undefined"
      ? process.env["VITE_SITE_ORIGIN"] || process.env["SITE_ORIGIN"]
      : "") ||
    "";
  return raw.replace(/\/$/, "");
}

function isLocalHost(host: string) {
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
}

/** Canonical public origin. Localhost follows the current request; everything else is iotahome.site. */
export function originFromRequest(request?: Request) {
  const forced = envOrigin();
  if (forced) return forced;
  if (!request) return ORIGIN;
  try {
    const url = new URL(request.url);
    const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = (forwarded || url.host).toLowerCase();
    const hostname = host.split(":")[0] ?? host;
    if (isLocalHost(hostname)) {
      const proto = (request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")).replace(
        /:$/,
        "",
      );
      return `${proto}://${host}`;
    }
  } catch {
    /* keep canonical */
  }
  return ORIGIN;
}

export function swapLocalePath(pathname: string, next: SiteLocale) {
  if (/^\/(en|zh)(?=\/|$)/.test(pathname)) {
    return pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${next}`);
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}
