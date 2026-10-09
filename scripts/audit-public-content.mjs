// Read-only raw HTML audit. HTTP availability is not proof of search indexing.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const run = promisify(execFile);
const origin = process.argv[2] || "https://iotahome.site";
if (!/^https:\/\/iotahome\.site$|^http:\/\/127\.0\.0\.1:\d+$/.test(origin))
  throw new Error("Unsupported audit origin");
const output = process.argv[3] || join(tmpdir(), "iota-public-content-audit.json");
const projects = ["flyai", "nosana", "gonka", "akash", "ionet", "vast", "golem"];
const locales = ["zh", "zh-TW", "en", "ko", "ja"];
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const text = (s) => decode(s.replace(/<[^>]*>/g, "").trim());
const paths = locales.flatMap((l) =>
  projects.flatMap((p) => [`/${l}/projects/${p}`, `/${l}/learn/${p}-monitor-guide`]),
);
paths.push("/zh/learn/how-rewards-work", "/zh", "/robots.txt", "/sitemap.xml", "/llms.txt");
const results = [];
async function audit(path) {
  try {
    const { stdout } = await run(
      "curl",
      [
        "-sS",
        "--compressed",
        "-L",
        "--max-time",
        "25",
        "-A",
        "Mozilla/5.0",
        origin + path,
        "-w",
        "\n__AUDIT_HTTP__%{http_code}",
      ],
      { maxBuffer: 8_000_000 },
    );
    const [html, status] = stdout.split("\n__AUDIT_HTTP__");
    const schemas = [
      ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
    ].map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return { invalidJson: true };
      }
    });
    return {
      path,
      status: Number(status),
      title: text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || ""),
      h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1])),
      canonical: decode(html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] || ""),
      robots: html.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/)?.[1] || "",
      schemas: schemas.map((s) => ({
        "@type": s["@type"],
        about: s.about,
        datePublished: s.datePublished,
        dateModified: s.dateModified,
        graph: s["@graph"],
      })),
      hasServerBody: html.includes("<main") || html.includes("<article"),
      indexStatus: "unknown_requires_search_console",
    };
  } catch (e) {
    return { path, error: e.message, indexStatus: "unknown_requires_search_console" };
  }
}
let cursor = 0;
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (cursor < paths.length) {
      const i = cursor++;
      results[i] = await audit(paths[i]);
    }
  }),
);
const collisions = locales.flatMap((l) =>
  projects.flatMap((p) => {
    const tool = results.find((r) => r.path === `/${l}/projects/${p}`),
      guide = results.find((r) => r.path === `/${l}/learn/${p}-monitor-guide`);
    return tool?.title && tool.title === guide?.title
      ? [{ locale: l, project: p, title: tool.title }]
      : [];
  }),
);
const report = {
  checkedAt: new Date().toISOString(),
  origin,
  checks: results.length,
  ok: results.filter((r) => r.status === 200).length,
  titleCollisions: collisions,
  searchConsole: {
    status: "not_checked",
    note: "Do not infer indexing from 200, canonical, sitemap or site: queries.",
  },
  results,
};
writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(
  JSON.stringify({
    output,
    checks: report.checks,
    ok: report.ok,
    titleCollisions: collisions.length,
    failures: results.filter((r) => r.error || r.status !== 200).map((r) => r.path),
  }),
);
