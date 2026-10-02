import { describe, expect, it } from "vitest";
import { LOCALES, LANGUAGE_TAG, detectLocaleFromRequest, swapLocalePath } from "./site";
import { articles } from "../components/site/articles";
import { blogPosts } from "../components/site/blog-posts";
import { content } from "../components/site/content";
import { buildSitemapXml } from "./crawl";

describe("five language website", () => {
  it("honors saved language and correctly distinguishes traditional Chinese", () => {
    const request = (language: string, cookie = "") =>
      new Request("https://iotahome.site", { headers: { "accept-language": language, cookie } });
    expect(detectLocaleFromRequest(request("zh-HK,zh;q=0.8"))).toBe("zh-TW");
    expect(detectLocaleFromRequest(request("zh-Hant-TW"))).toBe("zh-TW");
    expect(detectLocaleFromRequest(request("en;q=0.5,ko-KR;q=1"))).toBe("ko");
    expect(detectLocaleFromRequest(request("ja-JP"))).toBe("ja");
    expect(detectLocaleFromRequest(request("en", "iota-locale=zh-TW"))).toBe("zh-TW");
    expect(detectLocaleFromRequest(request("ja", "iota-locale=ko"))).toBe("ko");
    expect(detectLocaleFromRequest(request("en", "iota-locale=zh-INVALID"))).toBe("en");
  });
  it("switches languages without losing the current article path", () => {
    for (const from of LOCALES)
      for (const to of LOCALES) {
        expect(swapLocalePath(`/${from}/learn/find-miner-id`, to)).toBe(
          `/${to}/learn/find-miner-id`,
        );
      }
    expect(swapLocalePath("/english", "ko")).toBe("/ko/english");
  });
  it("preserves every article link and Markdown block while translating complete pages", () => {
    for (const locale of ["zh-TW", "ko", "ja"] as const) {
      const source = locale === "zh-TW" ? "zh" : "en";
      expect(content[locale].guideTitle).toBeTruthy();
      if (locale !== "zh-TW")
        expect(content[locale].guideTitle).not.toBe(content[source].guideTitle);
      for (const article of [...articles, ...blogPosts]) {
        expect(article.title[locale]).toBeTruthy();
        if (locale !== "zh-TW") expect(article.title[locale]).not.toBe(article.title[source]);
        expect(article.body[locale]).toHaveLength(article.body[source].length);
        article.body[source].forEach((block, index) => {
          const translated = article.body[locale][index]!;
          expect(translated).not.toMatch(/(?:QQTOKEN|ZXQ\d+|99887\d{5})/);
          if (/^(## |- |> )/.test(block))
            expect(translated.startsWith(block.slice(0, block.startsWith("## ") ? 3 : 2))).toBe(
              true,
            );
          expect([...translated.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1])).toEqual(
            [...block.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]),
          );
        });
      }
      expect(buildSitemapXml()).toContain(`hreflang="${LANGUAGE_TAG[locale]}"`);
    }
  });
});
