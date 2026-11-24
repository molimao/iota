// Derive static crawl files from the same content that renders public pages.
import { createServer } from "vite";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
const cache = mkdtempSync(join(tmpdir(), "iota-crawl-"));
const server = await createServer({
  configFile: false,
  cacheDir: cache,
  server: { middlewareMode: true, ws: false, hmr: false },
  resolve: { alias: { "@": resolve("src") } },
});
try {
  const crawl = await server.ssrLoadModule("/src/lib/crawl.ts");
  for (const [file, fn] of [
    ["sitemap.xml", "buildSitemapXml"],
    ["robots.txt", "buildRobotsTxt"],
    ["llms.txt", "buildLlmsTxt"],
    ["llms-full.txt", "buildLlmsFullTxt"],
  ])
    writeFileSync("public/" + file, crawl[fn]());
  const { articles } = await server.ssrLoadModule("/src/components/site/articles.ts");
  const { blogPosts } = await server.ssrLoadModule("/src/components/site/blog-posts.ts");
  const articlePaths = [
    ...articles.map(({ slug }) => "/learn/" + slug),
    ...blogPosts.map(({ slug }) => "/blog/" + slug),
  ].sort();
  const lines = articlePaths.map((path) => `  ${JSON.stringify(path)},`).join("\n");
  writeFileSync(
    "src/lib/ad-article-paths.ts",
    "/** Locale-less public article paths. Slugs only; article bodies stay out of the ad runtime. */\n" +
      `export const publicArticlePaths = [\n${lines}\n] as const;\n`,
  );
  console.log(
    `Generated crawl files for ${crawl.crawlPages.length} public paths in five languages.`,
  );
} finally {
  await server.close();
  rmSync(cache, { recursive: true, force: true });
}
