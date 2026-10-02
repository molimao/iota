import traditional from "./translations/zh-TW.json";
import korean from "./translations/ko.json";
import japanese from "./translations/ja.json";
import type { SiteLocale } from "@/lib/site";

const dictionaries: Partial<Record<SiteLocale, Record<string, string>>> = {
  "zh-TW": traditional,
  ko: korean,
  ja: japanese,
};
const patterns = new Map<SiteLocale, Array<{ expression: RegExp; translated: string }>>();
for (const [locale, dictionary] of Object.entries(dictionaries)) {
  patterns.set(
    locale as SiteLocale,
    Object.entries(dictionary)
      .filter(([text]) => text.includes("{{0}}"))
      .map(([text, translated]) => ({
        expression: new RegExp(
          "^" +
            text
              .split(/\{\{\d+\}\}/)
              .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              .join("(.+?)") +
            "$",
        ),
        translated,
      })),
  );
}

export function localizeText(text: string, locale: SiteLocale): string {
  const exact = dictionaries[locale]?.[text];
  if (exact) return exact;
  for (const pattern of patterns.get(locale) ?? []) {
    const match = text.match(pattern.expression);
    if (match)
      return pattern.translated.replace(
        /\{\{(\d+)\}\}/g,
        (_, index: string) => match[Number(index) + 1] ?? "",
      );
  }
  return text;
}

export function localizeValue<T>(value: T, locale: SiteLocale): T {
  if (typeof value === "string") return localizeText(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => localizeValue(item, locale)) as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeValue(item, locale)]),
    ) as T;
  }
  return value;
}

type Expanded<T> = T extends { en: infer E; zh: infer Z }
  ? T & { "zh-TW": Z; ko: E; ja: E }
  : T extends readonly (infer I)[]
    ? Expanded<I>[]
    : T extends object
      ? { [K in keyof T]: Expanded<T[K]> }
      : T;

/** Build all variants from committed static dictionaries, on both server and client. */
export function withLocales<T>(value: T): Expanded<T> {
  if (Array.isArray(value)) return value.map(withLocales) as Expanded<T>;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if ("en" in object && "zh" in object) {
      return {
        ...object,
        "zh-TW": localizeValue(object["zh"], "zh-TW"),
        ko: localizeValue(object["en"], "ko"),
        ja: localizeValue(object["en"], "ja"),
      } as Expanded<T>;
    }
    return Object.fromEntries(
      Object.entries(object).map(([key, item]) => [key, withLocales(item)]),
    ) as Expanded<T>;
  }
  return value as Expanded<T>;
}
