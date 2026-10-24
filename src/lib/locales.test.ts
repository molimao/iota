import { describe, expect, it } from "vitest";
import { LOCALES, LANGUAGE_TAG, detectLocaleFromRequest, swapLocalePath } from "./site";
import { articles } from "../components/site/articles";
import { blogPosts } from "../components/site/blog-posts";
import { content } from "../components/site/content";
import { projectDepthGuides } from "../components/site/project-depth";
import { buildSitemapXml } from "./crawl";

const depthSlugs = new Set(projectDepthGuides.map((guide) => guide.slug));
const placeholder = /(?:QQTOKEN|ZXQ\d+|99887\d{5})/;
const nativeScript = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/;

function targets(text: string) {
  return [...text.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]!);
}

function uniqueTargets(text: string) {
  return [...new Set(targets(text))].sort();
}

function sections(blocks: string[]) {
  const parts: string[][] = [];
  let current: string[] = [];
  for (const block of blocks) {
    if (block.startsWith("## ") && current.length) {
      parts.push(current);
      current = [];
    }
    current.push(block);
  }
  if (current.length) parts.push(current);
  return parts;
}

function counts(blocks: string[], prefix: string) {
  return blocks.filter((block) => block.startsWith(prefix)).length;
}

function depthShape(source: string[], translated: string[], locale: string, slug: string) {
  const where = `${locale}: ${slug}`;
  expect(translated.length, where).toBeGreaterThan(0);
  expect(
    translated.every((block) => block.trim().length > 0),
    where,
  ).toBe(true);
  for (const block of translated) expect(block, where).not.toMatch(placeholder);
  const sourceParts = sections(source);
  const translatedParts = sections(translated);
  expect(counts(translated, "## "), where).toBe(counts(source, "## "));
  expect(translatedParts.length, where).toBe(sourceParts.length);
  expect(
    translatedParts.map((part) => counts(part, "- ")),
    where,
  ).toEqual(sourceParts.map((part) => counts(part, "- ")));
  expect(counts(translated, "> "), where).toBe(counts(source, "> "));
  expect(counts(translated, "|"), where).toBe(counts(source, "|"));
  const perSection = sourceParts.every(
    (part, index) =>
      uniqueTargets(part.join("\n")).join("\n") ===
      uniqueTargets(translatedParts[index]!.join("\n")).join("\n"),
  );
  if (perSection) {
    sourceParts.forEach((part, index) => {
      expect(uniqueTargets(translatedParts[index]!.join("\n")), where).toEqual(
        uniqueTargets(part.join("\n")),
      );
    });
  } else {
    expect(uniqueTargets(translated.join("\n")), where).toEqual(uniqueTargets(source.join("\n")));
    expect(translatedParts.length, where).toBe(sourceParts.length);
  }
  const joined = translated.join("\n");
  const stripped = joined.replace(/`[^`]+`|\]\([^)]+\)/g, "");
  expect(nativeScript.test(stripped), where).toBe(true);
  expect(joined, where).not.toBe(source.join("\n"));
}

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
    const pages = [...articles, ...blogPosts];
    for (const locale of ["zh-TW", "ko", "ja"] as const) {
      const source = locale === "zh-TW" ? "zh" : "en";
      expect(content[locale].guideTitle).toBeTruthy();
      if (locale !== "zh-TW")
        expect(content[locale].guideTitle).not.toBe(content[source].guideTitle);
      for (const article of pages.filter((item) => depthSlugs.has(item.slug))) {
        expect(article.title[locale]).toBeTruthy();
        if (locale !== "zh-TW") expect(article.title[locale]).not.toBe(article.title[source]);
        depthShape(article.body[source], article.body[locale], locale, article.slug);
        expect(article.body[locale].join("\n"), locale + ": " + article.slug).not.toBe(
          article.body.en.join("\n"),
        );
      }
      for (const article of pages.filter((item) => !depthSlugs.has(item.slug))) {
        expect(article.title[locale]).toBeTruthy();
        if (locale !== "zh-TW") expect(article.title[locale]).not.toBe(article.title[source]);
        const sourceBody = article.body[source];
        const translated = article.body[locale];
        expect(translated).toHaveLength(sourceBody.length);
        sourceBody.forEach((block, index) => {
          const line = translated[index]!;
          expect(line).not.toMatch(placeholder);
          if (/^(## |- |> )/.test(block))
            expect(
              line.startsWith(block.slice(0, block.startsWith("## ") ? 3 : 2)),
              locale + ": " + article.slug + ": " + index + ": " + line,
            ).toBe(true);
          expect(targets(line), locale + ": " + article.slug + ": " + index + ": " + line).toEqual(
            targets(block),
          );
        });
      }
      expect(buildSitemapXml()).toContain(`hreflang="${LANGUAGE_TAG[locale]}"`);
    }
  });
});
