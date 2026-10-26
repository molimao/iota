import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  adoptDepthArticle,
  articleClusterMeta,
  articles,
  getArticle,
  type Article,
} from "../components/site/articles";
import {
  createDepthPackLoader,
  loadDepthArticle,
  mergeDepthArticle,
  projectDepthGuides,
  withProjectDepth,
} from "../components/site/project-depth";
import {
  acceptedDepthProjectIds,
  projectDepthMeta,
} from "../components/site/project-depth/manifest";
import { guidesForProject } from "../components/site/project-guides";
import { PROJECT_IDS } from "./projects";
import { LOCALES } from "./site";
import { seo } from "../components/site/seo";
import { learnRouteHead } from "../routes/$locale.learn.{-$slug}";
import { buildArticleMarkdown } from "./crawl";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const generator = path.join(root, "scripts/generate-project-depth.mjs");

function label(value: string): Article["title"] {
  return { zh: value, "zh-TW": value, en: value, ko: value, ja: value };
}

function blocks(value: string): Article["body"] {
  return { zh: [value], "zh-TW": [value], en: [value], ko: [value], ja: [value] };
}

function emptyBody(): Article["body"] {
  return { zh: [], "zh-TW": [], en: [], ko: [], ja: [] };
}

function guideQualityProblems(guide: Article, paths = new Set(articles.map((item) => item.slug))) {
  const problems: string[] = [];
  if ((guide.sources?.length ?? 0) < 2) problems.push(`${guide.slug} needs two sources`);
  for (const source of guide.sources ?? []) {
    try {
      if (new URL(source.url).protocol !== "https:")
        problems.push(`${guide.slug} source ${source.url}`);
    } catch {
      problems.push(`${guide.slug} source ${source.url}`);
    }
  }
  for (const locale of LOCALES) {
    const blocks = guide.body[locale] ?? [];
    const text = blocks.join("\n");
    const headings = text.match(/^##\s+\S/gm) ?? [];
    const cells = (guide.comparison?.[locale]?.rows ?? []).flat().join("");
    const faqs = (guide.questions?.[locale] ?? [])
      .map((item) => `${item.question}${item.answer}`)
      .join("");
    const visible = `${guide.summary?.[locale] ?? ""}${text}${cells}${faqs}`;
    if (text.length < 600)
      problems.push(`${guide.slug}/${locale} body has ${text.length} characters`);
    if (headings.length < 3)
      problems.push(`${guide.slug}/${locale} has ${headings.length} headings`);
    if (locale === "en" && text.trim().split(/\s+/).filter(Boolean).length < 280) {
      problems.push(`${guide.slug}/${locale} has fewer than 280 words`);
    }
    if (visible.length < 900) {
      problems.push(`${guide.slug}/${locale} visible text has ${visible.length} characters`);
    }
    if (!guide.summary?.[locale]) problems.push(`${guide.slug}/${locale} summary`);
    const faqCount = guide.questions?.[locale]?.length ?? 0;
    const minimumFaqs = guide.slug.endsWith("-mining-monitor-guide") ? 6 : 3;
    if (faqCount < minimumFaqs) {
      problems.push(`${guide.slug}/${locale} has ${faqCount} questions; need ${minimumFaqs}`);
    }
    if (locale !== "en" && text === (guide.body.en ?? []).join("\n")) {
      problems.push(`${guide.slug}/${locale} repeats English`);
    }
    for (const match of text.matchAll(/\]\(\/learn\/([^#)]+)(?:#[^)]*)?\)/g)) {
      if (!paths.has(match[1]!)) problems.push(`${guide.slug} links to ${match[1]}`);
    }
    if (getArticle(guide.slug)?.title[locale] !== guide.title[locale]) {
      problems.push(`${guide.slug}/${locale} title drifted`);
    }
  }
  return problems;
}

function guide(slug: string, body = "body"): Article {
  return {
    slug,
    project: "btc",
    topic: label("Topic"),
    title: label(slug),
    description: label("Description"),
    body: blocks(body),
  };
}

function fiveGuides() {
  return Array.from({ length: 5 }, (_, index) => guide(`depth-loader-${index}`, `body ${index}`));
}

function runGenerator(args: string[]) {
  return spawnSync(process.execPath, [generator, ...args], { encoding: "utf8" });
}

function packSource(project: string, slugs: string[]) {
  const guides = slugs
    .map(
      (slug) => `{
        slug: "${slug}",
        project: "${project}",
        published: "2026-10-24",
        topic: { zh: "主题", "zh-TW": "主題", en: "Topic", ko: "주제", ja: "題目" },
        title: { zh: "标题 ${slug}", "zh-TW": "標題 ${slug}", en: "Title ${slug}", ko: "제목 ${slug}", ja: "題名 ${slug}" },
        description: { zh: "描述", "zh-TW": "描述", en: "Description", ko: "설명", ja: "説明" },
        summary: { zh: "摘要", "zh-TW": "摘要", en: "Summary", ko: "요약", ja: "要約" },
        sources: [
          { name: "Docs", url: "https://example.com/docs" },
          { name: "Status", url: "https://example.com/status" },
        ],
        questions: {
          zh: [{ question: "问", answer: "答" }],
          "zh-TW": [{ question: "問", answer: "答" }],
          en: [{ question: "Q", answer: "A" }],
          ko: [{ question: "질문", answer: "답" }],
          ja: [{ question: "問", answer: "答" }],
        },
        body: {
          zh: ["BODYCANARY ${slug}"],
          "zh-TW": ["正文"],
          en: ["Body"],
          ko: ["본문"],
          ja: ["本文"],
        },
      }`,
    )
    .join(",\n");
  return `import type { Article } from "../articles";\nexport const ${project}DepthGuides: Article[] = [\n${guides}\n];\n`;
}

describe("project guide packs", () => {
  it("keeps each accepted project pack complete and reachable from its project", () => {
    const projects = [...new Set(projectDepthGuides.map((guide) => guide.project))];
    expect(projects).toHaveLength(acceptedDepthProjectIds.length);
    for (const project of projects) {
      if (!project || project === "all") throw new Error("A pack needs a specific project");
      const own = articles.filter((guide) => guide.project === project);
      expect(own.length, project).toBeGreaterThanOrEqual(5);
      const links = new Set(guidesForProject(project).map((guide) => guide.slug));
      const cluster = articleClusterMeta[project];
      expect(cluster, project).toBeDefined();
      for (const guide of own) {
        expect(links.has(guide.slug), guide.slug).toBe(true);
        expect(cluster?.slugs).toContain(guide.slug);
      }
    }
  });

  it("retains substantial native copy, distinct titles, sources and valid onward paths", () => {
    const paths = new Set(articles.map((guide) => guide.slug));
    expect(new Set(projectDepthGuides.map((guide) => guide.slug)).size).toBe(
      projectDepthGuides.length,
    );
    const problems = projectDepthGuides.flatMap((guide) => guideQualityProblems(guide, paths));
    expect(problems).toEqual([]);
    for (const locale of LOCALES) {
      const titles = projectDepthGuides.map((guide) => guide.title[locale]);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it("rejects an empty body and padded boilerplate that is not a useful page", () => {
    const empty = guide("empty-body", "");
    empty.body = emptyBody();
    empty.summary = label("See the docs.");
    empty.sources = [
      { name: "Docs", url: "https://example.com/docs" },
      { name: "Status", url: "https://example.com/status" },
    ];
    const emptyProblems = guideQualityProblems(empty, new Set(["empty-body"]));
    expect(emptyProblems.some((item) => item.includes("body has 0 characters"))).toBe(true);
    expect(emptyProblems.some((item) => item.includes("0 headings"))).toBe(true);
    expect(emptyProblems.some((item) => item.includes("visible text"))).toBe(true);

    const filler = `${"placeholder ".repeat(40)}\n${"note ".repeat(100)}`;
    const padded = guide("padded-boilerplate", filler);
    padded.summary = label("Overview");
    padded.questions = {
      zh: [
        { question: "问", answer: "答" },
        { question: "问二", answer: "答二" },
      ],
      "zh-TW": [
        { question: "問", answer: "答" },
        { question: "問二", answer: "答二" },
      ],
      en: [
        { question: "Q", answer: "A" },
        { question: "Q2", answer: "A2" },
      ],
      ko: [
        { question: "질문", answer: "답" },
        { question: "질문2", answer: "답2" },
      ],
      ja: [
        { question: "問", answer: "答" },
        { question: "問2", answer: "答2" },
      ],
    };
    padded.sources = empty.sources;
    const paddedProblems = guideQualityProblems(padded, new Set(["padded-boilerplate"]));
    expect(padded.body.en.join("\n").length).toBeGreaterThanOrEqual(600);
    expect(
      paddedProblems.some((item) =>
        item.includes("padded-boilerplate/en has fewer than 280 words"),
      ),
    ).toBe(true);
    expect(paddedProblems.some((item) => item.includes("has 0 headings"))).toBe(true);
    expect(paddedProblems.some((item) => item.includes("visible text"))).toBe(false);
  });

  it("runs with the test mode flag that keeps accepted guide bodies", () => {
    expect(import.meta.env.MODE).toBe("test");
  });

  it("ships metadata without bodies and matches full guides used by markdown", () => {
    expect(projectDepthMeta.map((guide) => guide.slug).sort()).toEqual(
      [...projectDepthGuides.map((guide) => guide.slug)].sort(),
    );
    for (const meta of projectDepthMeta) {
      expect(meta.summary).toBeUndefined();
      expect(meta.questions).toBeUndefined();
      expect(meta.sources).toBeUndefined();
      expect(meta.decision).toBeUndefined();
      expect(meta.keywords).toBeUndefined();
      expect(meta.comparison).toBeUndefined();
      expect(meta.evidence).toBeUndefined();
      for (const locale of LOCALES) expect(meta.body[locale]).toEqual([]);
      const full = projectDepthGuides.find((guide) => guide.slug === meta.slug);
      expect(full?.title).toEqual(meta.title);
      expect(full?.description).toEqual(meta.description);
      expect(full?.topic).toEqual(meta.topic);
      expect(full?.project).toEqual(meta.project);
      expect(full?.published).toEqual(meta.published);
      expect(full?.modified).toEqual(meta.modified);
      expect(full?.related).toEqual(meta.related);
      expect(full?.summary?.en.length).toBeGreaterThan(0);
      expect(full?.questions?.en.length).toBeGreaterThan(0);
      expect((full?.sources?.length ?? 0) > 0).toBe(true);
      expect(full?.body.en.length).toBeGreaterThan(0);
      const markdown = buildArticleMarkdown(full!, "en", "https://iotahome.site", "learn");
      const summaryChunks = full!
        .summary!.en.split(/\[[^\]]*\]\([^)]*\)/)
        .map((part) => part.trim())
        .filter((part) => part.length > 24);
      expect(summaryChunks.length).toBeGreaterThan(0);
      for (const chunk of summaryChunks) expect(markdown).toContain(chunk);
      expect(markdown).toContain(full!.questions!.en[0]!.question);
      expect(markdown).toContain(full!.sources![0]!.url);
      const schema = JSON.stringify(seo("en", "learn", meta.slug).scripts);
      expect(schema).toContain(full!.questions!.en[0]!.question);
      expect(schema).toContain(full!.sources![0]!.url);
      const firstBlock = full!.body.en[0]!.replace(
        /\]\(\/(?!\/)([^)]+)\)/g,
        (_, linked: string) => {
          const alreadyPrefixed = /^(?:zh-TW|en|zh|ko|ja|images|evidence)(?:\/|$)/.test(linked);
          return `](https://iotahome.site/${alreadyPrefixed ? linked : `en/${linked}`})`;
        },
      );
      expect(markdown).toContain(firstBlock);
      expect(markdown).toContain(full!.title.en);
    }
  });

  it("does not treat a partial depth-pack list as the full project catalog", () => {
    const loaded = [...new Set(projectDepthGuides.map((guide) => guide.project))].sort();
    const accepted = [...acceptedDepthProjectIds].sort();
    expect(new Set(acceptedDepthProjectIds).size).toBe(acceptedDepthProjectIds.length);
    expect(loaded).toEqual(accepted);
    const catalog = [...PROJECT_IDS].sort();
    const missing = catalog.filter((id) => !loaded.includes(id));
    if (accepted.length === catalog.length) {
      expect(loaded).toEqual(catalog);
      expect(missing).toEqual([]);
    } else {
      expect(accepted.length).toBeLessThan(catalog.length);
      expect(missing.length).toBeGreaterThan(0);
    }
  });

  it("lists each guide in one cluster and keeps the comparison guide generic", () => {
    const owner = new Map<string, string>();
    for (const [id, group] of Object.entries(articleClusterMeta)) {
      expect(group, id).toBeDefined();
      if (!group) continue;
      for (const slug of group.slugs) {
        expect(owner.has(slug), `${slug} is also in ${owner.get(slug)}`).toBe(false);
        owner.set(slug, id);
        expect(getArticle(slug)?.slug).toBe(slug);
      }
    }
    const accepted = new Set<string>(acceptedDepthProjectIds);
    for (const guide of articles) {
      if (!guide.project || guide.project === "all" || !accepted.has(guide.project)) continue;
      expect(owner.get(guide.slug)).toBe(guide.project);
    }
    expect(articleClusterMeta["compare"]?.slugs).toContain("iota-xid-quantus-compared");
    expect(guidesForProject("btc").some((item) => item.slug === "iota-xid-quantus-compared")).toBe(
      false,
    );
    expect(guidesForProject("iota").some((item) => item.slug === "iota-xid-quantus-compared")).toBe(
      true,
    );
  });

  it("preserves the original published date without keeping a replaced comparison", () => {
    const old = guide("preserved-date", "old");
    old.published = "2026-09-12";
    old.comparison = {
      zh: { headers: ["旧"], rows: [["甲"]] },
      "zh-TW": { headers: ["舊"], rows: [["甲"]] },
      en: { headers: ["Old"], rows: [["A"]] },
      ko: { headers: ["이전"], rows: [["가"]] },
      ja: { headers: ["旧"], rows: [["甲"]] },
    };
    const full = guide("preserved-date", "new");
    full.published = "2026-10-24";
    const merged = mergeDepthArticle(old, full);
    expect(merged.published).toBe("2026-09-12");
    expect(merged.body.en).toEqual(["new"]);
    expect(merged.comparison).toBeUndefined();
    expect(withProjectDepth(old)).toBe(old);
    expect(adoptDepthArticle(guide("not-a-real-depth-slug"))).toBeNull();
  });
});

describe("learn head hydration", () => {
  it("adopts the serialized loader article before seo when the catalog is still bare", () => {
    const full = projectDepthGuides.find((guide) => (guide.questions?.en.length ?? 0) > 0);
    expect(full?.slug).toBeTruthy();
    const slug = full!.slug;
    const saved = getArticle(slug);
    const bare = projectDepthMeta.find((guide) => guide.slug === slug);
    expect(saved && bare).toBeTruthy();
    try {
      adoptDepthArticle(structuredClone(bare!));
      expect(getArticle(slug)?.body.en).toEqual([]);
      expect(getArticle(slug)?.questions).toBeUndefined();
      expect(getArticle(slug)?.sources).toBeUndefined();
      expect(getArticle(slug)?.summary).toBeUndefined();
      const serialized = JSON.parse(JSON.stringify(full)) as Article;
      const head = learnRouteHead({ locale: "en", slug, article: serialized });
      const direct = seo("en", "learn", slug);
      expect(head).toEqual(direct);
      const faq = JSON.stringify(head.scripts);
      expect(faq).toContain(full!.questions!.en[0]!.question);
      expect(faq).toContain(full!.summary!.en);
      expect(faq).toContain(full!.sources![0]!.url);
      expect(getArticle(slug)?.body.en.length).toBeGreaterThan(0);
      const indexHead = learnRouteHead({ locale: "en", article: null });
      expect(JSON.stringify(indexHead.scripts)).not.toContain(full!.questions!.en[0]!.question);
      expect(getArticle(slug)?.questions?.en[0]?.question).toBe(full!.questions!.en[0]!.question);
    } finally {
      if (saved) adoptDepthArticle(structuredClone(saved));
    }
  });
});

describe("depth pack loading", () => {
  it("retries a rejected pack and ignores unknown or unsafe slugs", async () => {
    const guides = fiveGuides();
    const meta = guides.map((item) => ({ ...item, body: emptyBody() }));
    let started = 0;
    const loader = createDepthPackLoader(
      {
        "./btc.ts": async () => {
          started += 1;
          if (started === 1) throw new Error("transient");
          return { btcDepthGuides: guides };
        },
      },
      meta,
    );
    await expect(loader.loadArticle("depth-loader-0")).rejects.toThrow(/transient/);
    await expect(loader.loadArticle("depth-loader-0")).resolves.toMatchObject({
      slug: "depth-loader-0",
      body: blocks("body 0"),
    });
    await loader.loadArticle("depth-loader-0");
    expect(started).toBe(2);
    await expect(loader.loadArticle("../btc")).resolves.toBeNull();
    await expect(loader.loadArticle("missing-guide")).resolves.toBeNull();
    await expect(loader.loadArticle("btc.ts")).resolves.toBeNull();
    expect(started).toBe(2);

    let blocked = 0;
    const unsafe = createDepthPackLoader(
      {
        "./btc.ts": async () => {
          blocked += 1;
          return { btcDepthGuides: guides };
        },
      },
      [{ slug: "evil-guide", project: "../btc" }],
    );
    await expect(unsafe.loadArticle("evil-guide")).resolves.toBeNull();
    expect(blocked).toBe(0);
  });

  it("shares one in-flight pack load and rejects an unexpected module path", async () => {
    const guides = fiveGuides();
    let started = 0;
    let release: (value: Record<string, unknown>) => void = () => {};
    const gate = new Promise<Record<string, unknown>>((resolve) => {
      release = resolve;
    });
    const loader = createDepthPackLoader(
      {
        "./btc.ts": () => {
          started += 1;
          return gate;
        },
      },
      guides.map((item) => ({ ...item, body: emptyBody() })),
    );
    const first = loader.loadArticle("depth-loader-1");
    const second = loader.loadArticle("depth-loader-1");
    expect(started).toBe(1);
    release({ btcDepthGuides: guides });
    expect(await first).toBe(await second);
    await expect(
      createDepthPackLoader({ "./btc.js": async () => ({}) }, []).loadAll(),
    ).rejects.toThrow(/Unexpected depth pack module/);
  });

  it("does not load an unknown slug from the accepted catalog", async () => {
    await expect(loadDepthArticle("not-a-real-guide")).resolves.toBeNull();
    await expect(loadDepthArticle("../btc")).resolves.toBeNull();
    await expect(loadDepthArticle("btc.ts")).resolves.toBeNull();
    await expect(loadDepthArticle("")).resolves.toBeNull();
  });
});

describe("project depth manifest generator", () => {
  it("reads only the allowlist and writes body-free metadata", () => {
    const script = readFileSync(generator, "utf8");
    expect(script.includes("process.env")).toBe(false);
    expect(script.includes("https://")).toBe(false);
    expect(script.includes("http://")).toBe(false);

    const dir = mkdtempSync(path.join(tmpdir(), "iota-depth-"));
    const packs = path.join(dir, "packs");
    mkdirSync(packs);
    const slugs = ["btc-a", "btc-b", "btc-c", "btc-d", "btc-e"];
    writeFileSync(path.join(packs, "btc.ts"), packSource("btc", slugs));
    writeFileSync(
      path.join(packs, "ethw.ts"),
      `import "node:fs";\nexport const leak = "SIBLINGCANARY";\n`,
    );
    const allowlist = path.join(dir, "accepted-projects.json");
    const out = path.join(dir, "manifest.ts");
    writeFileSync(allowlist, JSON.stringify(["btc"]));
    const result = runGenerator(["--allowlist", allowlist, "--out", out, "--packs", packs]);
    expect(result.status, result.stderr).toBe(0);
    const manifest = readFileSync(out, "utf8");
    expect(manifest).toContain('"./btc.ts"');
    expect(manifest).not.toContain("ethw.ts");
    expect(manifest).not.toContain("SIBLINGCANARY");
    expect(manifest).not.toContain("BODYCANARY");
    expect(manifest).not.toContain("https://example.com/docs");
    expect(manifest).not.toContain('"question"');
    expect(manifest).not.toContain("Summary");
    expect(manifest).toContain("Title btc-a");
    expect(manifest).toContain('"en": []');
    expect(manifest).not.toContain("comparison");
    expect(manifest).not.toContain("evidence");
  }, 30_000);

  it("rejects unsafe ids and packs that are not five local guides", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "iota-depth-"));
    const packs = path.join(dir, "packs");
    mkdirSync(packs);
    writeFileSync(path.join(dir, "btc.ts"), `export const leak = "PARENTCANARY";\n`);
    const cases = [
      {
        allow: ["../btc"],
        source: packSource("btc", ["btc-a", "btc-b", "btc-c", "btc-d", "btc-e"]),
      },
      {
        allow: ["btc"],
        source: `import { readFileSync } from "node:fs";\nimport type { Article } from "../articles";\nexport const btcDepthGuides: Article[] = [];\n`,
      },
      {
        allow: ["btc"],
        source: packSource("btc", ["btc-a", "btc-b", "btc-c", "btc-d"]),
      },
      {
        allow: ["btc"],
        source: packSource("ethw", ["ethw-a", "ethw-b", "ethw-c", "ethw-d", "ethw-e"]),
      },
      {
        allow: ["all"],
        source: packSource("all", ["all-a", "all-b", "all-c", "all-d", "all-e"]),
      },
    ];
    for (const [index, item] of cases.entries()) {
      const allowlist = path.join(dir, `allow-${index}.json`);
      const out = path.join(dir, `out-${index}.ts`);
      writeFileSync(path.join(packs, "btc.ts"), item.source);
      writeFileSync(allowlist, JSON.stringify(item.allow));
      const result = runGenerator(["--allowlist", allowlist, "--out", out, "--packs", packs]);
      expect(result.status, item.allow.join(",")).not.toBe(0);
      expect(result.stderr).not.toContain("PARENTCANARY");
      expect(result.stderr).not.toContain("BODYCANARY");
    }
  }, 60_000);

  it("regenerates the checked-in manifest without reading unaccepted packs", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "iota-depth-"));
    const out = path.join(dir, "manifest.ts");
    const missing = path.join(dir, "missing-packs");
    const emptyAllow = path.join(dir, "accepted-projects.json");
    writeFileSync(emptyAllow, "[]\n");
    expect(runGenerator(["--allowlist", emptyAllow, "--out", out, "--packs", missing]).status).toBe(
      0,
    );
    const realOut = path.join(dir, "real-manifest.ts");
    const real = runGenerator([
      "--allowlist",
      path.join(root, "src/components/site/project-depth/accepted-projects.json"),
      "--out",
      realOut,
      "--packs",
      path.join(root, "src/components/site/project-depth"),
    ]);
    expect(real.status, real.stderr).toBe(0);
    expect(readFileSync(realOut, "utf8")).toBe(
      readFileSync(path.join(root, "src/components/site/project-depth/manifest.ts"), "utf8"),
    );
  }, 20_000);
});
