import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import traditional from "../components/site/translations/zh-TW.json";
import korean from "../components/site/translations/ko.json";
import japanese from "../components/site/translations/ja.json";
import { localizeMessage } from "../components/site/locale";
import { content } from "../components/site/content";
import { articles } from "../components/site/articles";
import { blogPosts } from "../components/site/blog-posts";
import { projectFaq } from "../components/site/project-faq";
import { LOCALES, swapLocalePath } from "./site";

describe("localization regressions", () => {
  it("has translations for dashboard messages and two-language UI literals", () => {
    const used = { en: new Set<string>(), zh: new Set<string>() };
    function scan(path: string) {
      const source = ts.createSourceFile(
        path,
        readFileSync(path, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      function visit(node: ts.Node) {
        if (
          ts.isVariableDeclaration(node) &&
          node.name.getText(source) === "EN" &&
          node.initializer &&
          ts.isObjectLiteralExpression(node.initializer)
        ) {
          for (const row of node.initializer.properties)
            if (ts.isPropertyAssignment(row) && ts.isStringLiteral(row.initializer)) {
              used.en.add(row.initializer.text);
              used.zh.add(ts.isStringLiteral(row.name) ? row.name.text : row.name.getText(source));
            }
        }
        if (
          ts.isConditionalExpression(node) &&
          node.condition.getText(source) === "en" &&
          ts.isStringLiteral(node.whenTrue) &&
          ts.isStringLiteral(node.whenFalse)
        ) {
          used.en.add(node.whenTrue.text);
          used.zh.add(node.whenFalse.text);
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
    function walk(path: string) {
      for (const entry of readdirSync(path, { withFileTypes: true })) {
        const file = join(path, entry.name);
        if (entry.isDirectory()) walk(file);
        else if (/\.tsx?$/.test(file)) scan(file);
      }
    }
    walk("src/components");
    for (const [locale, dict, source] of [
      ["zh-TW", traditional, "zh"],
      ["ko", korean, "en"],
      ["ja", japanese, "en"],
    ] as const) {
      const missing = [...used[source]].filter(
        (text) => /[A-Za-z\u4e00-\u9fff]/.test(text) && !(dict as Record<string, string>)[text],
      );
      expect(missing, locale).toEqual([]);
    }
  });
  it("does not fall back to English sentences in localized editorial pages", () => {
    const sentences = (value: unknown): string[] =>
      typeof value === "string"
        ? [value]
        : Array.isArray(value)
          ? value.flatMap(sentences)
          : value && typeof value === "object"
            ? Object.values(value).flatMap(sentences)
            : [];
    for (const locale of ["ko", "ja"] as const) {
      const translated = new Set(sentences(content[locale]));
      for (const sentence of sentences(content.en))
        if (/[A-Za-z]+ [A-Za-z]+ [A-Za-z]+ [A-Za-z]+/.test(sentence))
          expect(translated.has(sentence), locale + ": " + sentence).toBe(false);
      for (const article of [...articles, ...blogPosts])
        article.body.en.forEach((block, index) => {
          if (/[A-Za-z]+ [A-Za-z]+ [A-Za-z]+ [A-Za-z]+/.test(block))
            expect(article.body[locale][index], locale + ": " + article.slug).not.toBe(block);
        });
    }
  });
  it("preserves privacy details and describes refresh rather than reward issuance", () => {
    for (const locale of ["zh-TW", "ko", "ja"] as const) {
      const privacy = content[locale].privacy.map(([, answer]) => answer).join(" ");
      expect(privacy).toContain("24");
      expect(privacy).toContain("JSON");
      expect(privacy).toContain("Lovable");
    }
    expect(
      japanese[
        "Device status is checked about every 30 seconds; rewards about every two minutes. Official sample time and the time this site fetched the data are different. Manual refresh has a 15-second cooldown."
      ],
    ).not.toContain("報酬が与えられます");
  });
  it("translates nested errors without losing the run ID or HTTP code", () => {
    expect(localizeMessage("任务 run-42：请求超时；状态连接失败：收益刷新超时", "zh-TW")).toBe(
      "任務 run-42：請求逾時；狀態連線失敗：收益更新逾時",
    );
    for (const locale of ["ko", "ja"] as const) {
      const text = localizeMessage("任务 run-42：请求超时", locale);
      expect(text).toContain("run-42");
      expect(text).not.toMatch(/Request|Run |任务|请求/);
    }
    expect(localizeMessage("上游返回 HTTP 503：请求超时", "zh-TW")).toBe(
      "上游回傳 HTTP 503：請求逾時",
    );
  });
  it("keeps current project, subscription view and anchors when changing language", () => {
    for (const from of LOCALES)
      for (const to of LOCALES) {
        expect(swapLocalePath(`/${from}/devices?project=flyai&view=membership#plans`, to)).toBe(
          `/${to}/devices?project=flyai&view=membership#plans`,
        );
        expect(swapLocalePath(`/${from}?project=flyai`, to)).toBe(`/${to}?project=flyai`);
      }
  });
  it("keeps FAQ coverage and paid quotas current in every language", () => {
    for (const locale of LOCALES) {
      const faq = projectFaq[locale];
      expect(faq.questions[1]![1]).toContain("fly.ai");
      expect(faq.questions[3]![1]).toContain("50");
      expect(faq.questions[3]![1]).toContain("Google");
      expect(faq.questions[3]![1]).not.toMatch(/\b10\b|最大10|最大3|最多 3|最多 10/);
    }
  });
});
