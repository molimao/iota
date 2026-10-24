import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleBlocks } from "../components/site/rich-text";

describe("guide field tables", () => {
  it("renders inline code, localized links and accessible field rows rather than raw pipes", () => {
    const html = renderToStaticMarkup(
      createElement(ArticleBlocks, {
        locale: "ja",
        blocks: [
          "## Fields",
          "| Field | Meaning |\n| --- | --- |\n| `locked` | Pending confirmation |\n| Tool | [PRL](/projects/prl) |",
          "## Next steps",
          "- Check accepted shares",
        ],
      }),
    );
    expect(html).toContain('<th scope="col">Field</th>');
    expect(html).toContain("<code>locked</code>");
    expect(html).toContain('href="/ja/projects/prl"');
    expect(html).toContain('id="section-0"');
    expect(html).toContain('id="section-2"');
    expect(html).toContain("<ul>");
    expect(html).not.toContain("| --- |");
    expect(html).toContain('class="article-comparison" tabindex="0"');
  });

  it("supports table rows split between blocks without consuming the following paragraph", () => {
    const html = renderToStaticMarkup(
      createElement(ArticleBlocks, {
        locale: "en",
        blocks: [
          "| Metric | Value |",
          "| :--- | ---: |",
          "| Rate | 12 H/s |",
          "A balance is not daily income.",
        ],
      }),
    );
    expect(html).toContain("<td>12 H/s</td>");
    expect(html).toContain("</table></div><p>A balance is not daily income.</p>");
  });
});
