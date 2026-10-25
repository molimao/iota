import { withLocales } from "./localization";
import { LOCALES } from "@/lib/site";
import { coreIotaArticles } from "./iota-core-articles";
import { tscGuide } from "./tsc-guide";
import { refreshIotaGuide, iotaTierGuides } from "./iota-guide-refresh";
import { csdGuide } from "./csd-guide";
import { bntGuide } from "./bnt-guide";
import { mdsGuide } from "./mds-guide";
import { searchSupportGuides } from "./search-support-guides";
import { currentIotaContent } from "./current-iota-content";
import { macStatusGuide } from "./mac-status-guide";
import { problemGuides } from "./problem-guides";
import { computeGuides } from "./compute-guides";
import type { Locale } from "./locale";
import type { ProjectId } from "@/lib/projects";
import { PROJECT_IDS } from "@/lib/projects";
import { projectGuides } from "./project-guides";
import { editionDate } from "@/lib/content-dates";
import { mergeDepthArticle, mergeProjectDepth, projectDepthGuides } from "./project-depth";
import { PROJECTS } from "@/lib/projects";

export type Article = {
  slug: string;
  published?: string;
  modified?: string;
  sources?: Array<{ name: string; url: string }>;
  project?: ProjectId | "all";
  subjects?: ProjectId[];
  evidence?: {
    capturedAt: string;
    image: string;
    caption: Record<Locale, string>;
    method: Record<Locale, string>;
    headers: Record<Locale, string[]>;
    rows: Record<Locale, string[][]>;
    result: Record<Locale, string>;
    source: string;
  };
  decision?: { title: Record<Locale, string>; action: Record<Locale, string> };
  summary?: Record<Locale, string>;
  questions?: Record<Locale, Array<{ question: string; answer: string }>>;
  keywords?: Record<Locale, string[]>;
  related?: string[];
  comparison?: Record<Locale, { headers: string[]; rows: string[][] }>;
  comparisonTitle?: Record<Locale, string>;
  topic: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  body: Record<Locale, string[]>;
};

export const articles: Article[] = mergeProjectDepth([
  ...coreIotaArticles,
  ...projectGuides,
  ...computeGuides,
  macStatusGuide,
  ...problemGuides.map(currentIotaContent),
  ...searchSupportGuides.map(refreshIotaGuide),
  ...iotaTierGuides,
  mdsGuide,
  bntGuide,
  csdGuide,
  tscGuide,
]);

export function articleDates(article: Article, locale?: Locale) {
  const published = editionDate(article.published ?? "2026-09-12", locale);
  return {
    published,
    modified: [
      published,
      editionDate(article.modified ?? article.published ?? "2026-09-12", locale),
    ]
      .sort()
      .at(-1)!,
  };
}

export function articleProjects(article: Article): readonly ProjectId[] {
  return (
    article.subjects ??
    (article.project === "all"
      ? ([
          "iota",
          "xid",
          "quantus",
          "flyai",
          "nosana",
          "gonka",
          "akash",
          "ionet",
          "vast",
          "golem",
        ] as const)
      : [article.project ?? "iota"])
  );
}

export type ArticleCluster =
  "use" | "understand" | "start" | "read" | "xid" | "quantus" | "compare" | "compute" | "pools";

const baseArticleClusterMeta: Record<
  ArticleCluster,
  { title: Record<Locale, string>; slugs: string[] }
> = {
  use: {
    title: {
      zh: "使用场景与选择",
      "zh-TW": "使用情境與選擇",
      en: "Use cases and tool choice",
      ko: "사용 사례와 도구 선택",
      ja: "用途とツールの選び方",
    },
    slugs: [
      macStatusGuide.slug,
      mdsGuide.slug,
      bntGuide.slug,
      csdGuide.slug,
      ...problemGuides.map((a) => a.slug),
      ...searchSupportGuides.map((a) => a.slug),
      ...iotaTierGuides.map((a) => a.slug),
    ],
  },
  pools: {
    title: {
      zh: "矿池与 Worker",
      "zh-TW": "礦池與 Worker",
      en: "Pools and workers",
      ko: "풀과 워커",
      ja: "プールとワーカー",
    },
    slugs: projectGuides.filter((a) => a.slug.endsWith("-mining-monitor-guide")).map((a) => a.slug),
  },
  compute: {
    title: {
      zh: "算力与推理",
      en: "Compute and inference",
      "zh-TW": "算力與推理",
      ko: "컴퓨팅과 추론",
      ja: "計算と推論",
    },
    slugs: computeGuides.map((a) => a.slug),
  },
  ...withLocales({
    understand: {
      title: { en: "Product differences", zh: "产品区分" },
      slugs: ["what-is-iota-watch", "iota-train-at-home-vs-iota-coin", "what-is-sn9-iota"],
    },
    start: {
      title: { en: "Add devices", zh: "添加设备" },
      slugs: [
        "find-miner-id",
        "iota-miner-id-vs-payout-address",
        "google-account-device-list",
        "device-not-found",
      ],
    },
    read: {
      title: { en: "Status and rewards", zh: "状态与收益" },
      slugs: [
        "how-rewards-work",
        "iota-rewards-in-usd",
        "device-status",
        "what-refresh-interrupted-means",
        "data-sources-and-freshness",
        "training-history-and-metrics",
        "network-status-explained",
      ],
    },
  }),
  xid: {
    title: {
      zh: "XID / MMM 挖矿",
      "zh-TW": "XID / MMM 挖礦",
      en: "XID / MMM mining",
      ko: "XID / MMM 채굴",
      ja: "XID / MMM マイニング",
    },
    slugs: projectGuides.filter((a) => a.project === "xid").map((a) => a.slug),
  },
  quantus: {
    title: {
      zh: "Quantus / QTC 挖矿",
      "zh-TW": "Quantus / QTC 挖礦",
      en: "Quantus / QTC mining",
      ko: "Quantus / QTC 채굴",
      ja: "Quantus / QTC マイニング",
    },
    slugs: projectGuides.filter((a) => a.project === "quantus").map((a) => a.slug),
  },
  compare: {
    title: {
      zh: "项目对比",
      "zh-TW": "專案比較",
      en: "Project comparison",
      ko: "프로젝트 비교",
      ja: "プロジェクト比較",
    },
    slugs: ["iota-xid-quantus-compared"],
  },
};

// Keep full project packs together instead of spreading a wallet's questions across
// generic categories. The stable project anchor also works from project tool pages.
const depthProjects = new Set(projectDepthGuides.map((guide) => guide.project));
export const articleClusterMeta: Record<
  string,
  { title: Record<Locale, string>; slugs: string[] }
> = {
  ...Object.fromEntries(
    Object.entries(baseArticleClusterMeta)
      .map(
        ([id, group]) =>
          [
            id,
            {
              ...group,
              slugs: group.slugs.filter(
                (slug) => !depthProjects.has(articles.find((a) => a.slug === slug)?.project),
              ),
            },
          ] as const,
      )
      .filter(([, group]) => group.slugs.length),
  ),
  ...Object.fromEntries(
    PROJECT_IDS.filter((id) => depthProjects.has(id)).map((id) => [
      id,
      {
        title: Object.fromEntries(LOCALES.map((locale) => [locale, PROJECTS[id].name])) as Record<
          Locale,
          string
        >,
        slugs: articles.filter((article) => article.project === id).map((article) => article.slug),
      },
    ]),
  ),
};

const relatedBySlug: Record<string, string[]> = {
  "data-sources-and-freshness": [
    "what-refresh-interrupted-means",
    "network-status-explained",
    "how-rewards-work",
  ],
  "training-history-and-metrics": [
    "device-status",
    "how-rewards-work",
    "data-sources-and-freshness",
  ],
  "network-status-explained": [
    "data-sources-and-freshness",
    "device-not-found",
    "training-history-and-metrics",
  ],
  "what-is-iota-watch": ["iota-train-at-home-vs-iota-coin", "what-is-sn9-iota", "find-miner-id"],
  "find-miner-id": [
    "iota-miner-id-vs-payout-address",
    "google-account-device-list",
    "device-status",
  ],
  "how-rewards-work": ["iota-rewards-in-usd", "what-is-sn9-iota", "device-status"],
  "device-status": [
    "what-refresh-interrupted-means",
    "training-history-and-metrics",
    "network-status-explained",
  ],
  "iota-train-at-home-vs-iota-coin": [
    "what-is-iota-watch",
    "what-is-sn9-iota",
    "iota-rewards-in-usd",
  ],
  "iota-rewards-in-usd": [
    "how-rewards-work",
    "what-is-sn9-iota",
    "iota-train-at-home-vs-iota-coin",
  ],
  "what-refresh-interrupted-means": ["device-status", "device-not-found", "how-rewards-work"],
  "google-account-device-list": ["find-miner-id", "what-is-iota-watch", "device-not-found"],
  "what-is-sn9-iota": [
    "iota-train-at-home-vs-iota-coin",
    "iota-rewards-in-usd",
    "how-rewards-work",
  ],
  "device-not-found": ["find-miner-id", "device-status", "what-refresh-interrupted-means"],
};

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function adoptDepthArticle(full: Article): Article | null {
  const index = articles.findIndex((article) => article.slug === full.slug);
  const current = articles[index];
  if (!current) return null;
  const next = mergeDepthArticle(current, full);
  articles[index] = next;
  return next;
}

export function relatedArticles(slug: string) {
  return (getArticle(slug)?.related ?? relatedBySlug[slug] ?? [])
    .map((item) => getArticle(item))
    .filter((item): item is Article => Boolean(item));
}

export function articlePath(locale: Locale, slug: string) {
  return `/${locale}/learn/${slug}`;
}
