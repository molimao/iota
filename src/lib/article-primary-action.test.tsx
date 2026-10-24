import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { projectDepthGuides } from "../components/site/project-depth";
import { ArticleView } from "../components/site/pages";
import { LocaleContext } from "../components/site/locale";
import { projectPath } from "./projects";

describe("article monitor action", () => {
  it("keeps a clickable project monitor link beside the intro when a decision is present", () => {
    const article = projectDepthGuides.find((guide) => guide.project === "btc" && guide.decision);
    expect(article?.decision).toBeTruthy();
    const html = renderToStaticMarkup(
      createElement(
        LocaleContext.Provider,
        { value: "en" },
        createElement(ArticleView, { article: article!, section: "learn", related: [] }),
      ),
    );
    const decision = html.indexOf("article-decision");
    const action = html.indexOf("article-primary-action");
    const meta = html.indexOf("article-meta");
    const monitor = projectPath("en", "btc");
    expect(html).toContain(article!.decision!.title.en);
    expect(decision).toBeGreaterThan(-1);
    expect(action).toBeGreaterThan(decision);
    expect(action).toBeLessThan(meta);
    expect(html.slice(action, meta)).toContain(`href="${monitor}"`);
    expect(html.slice(action, meta)).toContain("Open this monitor");
    expect(html.lastIndexOf(`href="${monitor}"`)).toBeGreaterThan(meta);
  });
});
