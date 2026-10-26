import type { Article } from "../articles";
import type { ProjectId } from "@/lib/projects";
import { LOCALES } from "@/lib/site";
import { expansionMetadata } from "./metadata";
export { expansionMetadata };

type Text = Article["title"];
type Row = {
  slug: string;
  project: ProjectId;
  title: Text;
  answer: Text;
  checks: Text;
  example: Text;
  sources: string[];
  related: string[];
};
const headings = {
  zh: ["核对步骤", "示例", "继续查看", "打开项目监控"],
  "zh-TW": ["核對步驟", "示例", "繼續查看", "開啟專案監控"],
  en: ["What to check", "Example", "Continue", "Open project monitor"],
  ko: ["확인 순서", "예시", "이어서 보기", "프로젝트 모니터 열기"],
  ja: ["確認手順", "例", "次に確認すること", "プロジェクト監視を開く"],
};
const modules = import.meta.glob<Row[]>("./*.json", { import: "default" });
const cache = new Map<string, Promise<Row[]>>();

function render(row: Row): Article {
  const meta = expansionMetadata.find((item) => item.slug === row.slug);
  if (!meta) throw new Error(`Missing expansion metadata: ${row.slug}`);
  return {
    ...meta,
    body: Object.fromEntries(
      LOCALES.map((locale) => {
        const h = headings[locale];
        return [
          locale,
          [
            `## ${h[0]}`,
            row.checks[locale],
            `## ${h[1]}`,
            row.example[locale],
            `## ${h[2]}`,
            `[${h[3]}](/projects/${row.project})`,
          ],
        ];
      }),
    ) as Article["body"],
  };
}

export async function loadExpansionArticle(slug: string): Promise<Article | null> {
  const meta = expansionMetadata.find((item) => item.slug === slug);
  if (!meta?.project || meta.project === "all") return null;
  const key = `./${meta.project}.json`;
  const load = modules[key];
  if (!load) throw new Error(`Missing expansion content: ${meta.project}`);
  let pending = cache.get(key);
  if (!pending) {
    pending = load().catch((error: unknown) => {
      cache.delete(key);
      throw error;
    });
    cache.set(key, pending);
  }
  const row = (await pending).find((item) => item.slug === slug);
  if (!row) throw new Error(`Missing expansion article: ${slug}`);
  return render(row);
}

// Full text is available to SSR/crawl; browsers load the selected project's pair.
export const expansionGuides: Article[] =
  import.meta.env.SSR || import.meta.env.MODE === "test"
    ? await Promise.all(
        expansionMetadata.map(async (item) => {
          const article = await loadExpansionArticle(item.slug);
          if (!article) throw new Error(`Missing expansion article: ${item.slug}`);
          return article;
        }),
      )
    : expansionMetadata;
