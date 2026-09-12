export const ORIGIN = "https://iota-my-watch.lovable.app";
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

export function swapLocalePath(pathname: string, next: SiteLocale) {
  if (/^\/(en|zh)(?=\/|$)/.test(pathname)) {
    return pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${next}`);
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}
