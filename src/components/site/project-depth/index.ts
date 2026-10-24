import type { Article } from "../articles";
import { acceptedPackModules, projectDepthMeta } from "./manifest";

const PROJECT_FILE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type DepthPackModule = Record<string, unknown>;
export type DepthPackLoader = () => Promise<DepthPackModule>;

function projectFromPackKey(key: string) {
  const project = /^\.\/([a-z0-9]+(?:-[a-z0-9]+)*)\.ts$/.exec(key)?.[1];
  if (!project || key !== `./${project}.ts`) return null;
  return project;
}

function isGuide(value: unknown): value is Article {
  if (!value || typeof value !== "object") return false;
  const guide = value as Partial<Article>;
  return (
    typeof guide.slug === "string" &&
    typeof guide.project === "string" &&
    typeof guide.title === "object" &&
    guide.title !== null &&
    typeof guide.body === "object" &&
    guide.body !== null
  );
}

function guidesFromModule(mod: DepthPackModule, project: string) {
  const lists = Object.values(mod).filter(
    (value): value is Article[] =>
      Array.isArray(value) && value.every((item) => isGuide(item) && item.project === project),
  );
  const guides = lists[0];
  if (lists.length !== 1 || !guides || guides.length !== 5) {
    throw new Error(`Depth pack ${project} must export exactly five guides`);
  }
  if (new Set(guides.map((guide) => guide.slug)).size !== guides.length) {
    throw new Error(`Depth pack ${project} has duplicate slugs`);
  }
  return guides;
}

export function createDepthPackLoader(
  modules: Record<string, DepthPackLoader>,
  meta: readonly { slug: string; project?: string }[],
) {
  const cache = new Map<string, Promise<Article[]>>();
  const metaBySlug = new Map(meta.map((guide) => [guide.slug, guide]));

  function loaderFor(project: string) {
    if (!PROJECT_FILE.test(project) || projectFromPackKey(`./${project}.ts`) !== project)
      return null;
    const key = `./${project}.ts`;
    if (!Object.prototype.hasOwnProperty.call(modules, key)) return null;
    return modules[key] ?? null;
  }

  function loadPack(project: string) {
    const load = loaderFor(project);
    if (!load) return Promise.reject(new Error(`Rejected depth pack path: ${project}`));
    const pending = cache.get(project);
    if (pending) return pending;
    let started: Promise<DepthPackModule>;
    try {
      started = Promise.resolve(load());
    } catch (error) {
      return Promise.reject(error);
    }
    const task = started
      .then((mod) => guidesFromModule(mod, project))
      .catch((error: unknown) => {
        cache.delete(project);
        throw error;
      });
    cache.set(project, task);
    return task;
  }

  async function loadAll() {
    const projects = Object.keys(modules).map((key) => {
      const project = projectFromPackKey(key);
      if (!project || !Object.prototype.hasOwnProperty.call(modules, key)) {
        throw new Error(`Unexpected depth pack module: ${key}`);
      }
      return project;
    });
    const guides = (await Promise.all(projects.map((project) => loadPack(project)))).flat();
    const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
    if (bySlug.size !== guides.length || bySlug.size !== meta.length) {
      throw new Error("Accepted depth guides do not match metadata");
    }
    return meta.map((item) => {
      const full = bySlug.get(item.slug);
      if (!full) throw new Error(`Accepted depth guide missing: ${item.slug}`);
      return full;
    });
  }

  async function loadArticle(slug: string): Promise<Article | null> {
    if (!SLUG.test(slug)) return null;
    const entry = metaBySlug.get(slug);
    const project = entry?.project;
    if (!entry || !project || project === "all" || !loaderFor(project)) return null;
    const guides = await loadPack(project);
    return guides.find((guide) => guide.slug === slug) ?? null;
  }

  return { loadPack, loadAll, loadArticle };
}

const depthRuntime = createDepthPackLoader(acceptedPackModules, projectDepthMeta);

// Server, worker, and test builds await accepted packs so crawl, llms, and sitemap
// stay synchronous. Client bundles keep this branch out and load one pack on demand.
export const projectDepthGuides: Article[] =
  import.meta.env.SSR || import.meta.env.MODE === "test"
    ? await depthRuntime.loadAll()
    : projectDepthMeta;

const depthBySlug = new Map(projectDepthGuides.map((guide) => [guide.slug, guide]));

/** A substantive revision does not turn an existing URL into a newly published article. */
export function mergeDepthArticle(existing: Article, replacement: Article): Article {
  const next: Article = { ...replacement };
  if (existing.published) next.published = existing.published;
  if (
    existing.slug === "how-rewards-work" &&
    replacement.slug === "how-rewards-work" &&
    existing.evidence &&
    !replacement.evidence
  )
    next.evidence = existing.evidence;
  return next;
}

export function withProjectDepth(article: Article): Article {
  const replacement = depthBySlug.get(article.slug);
  if (!replacement) return article;
  return mergeDepthArticle(article, replacement);
}

export function mergeProjectDepth(guides: Article[]): Article[] {
  const existing = new Set(guides.map((guide) => guide.slug));
  return [
    ...guides.map(withProjectDepth),
    ...projectDepthGuides.filter((guide) => !existing.has(guide.slug)),
  ];
}

export function loadDepthArticle(slug: string) {
  return depthRuntime.loadArticle(slug);
}
