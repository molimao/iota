import { projectsCopy } from "./projects-copy";
import { PROJECTS, projectEntity, type MonitorProject } from "@/lib/projects";
import { guidesForProject } from "./site/project-guides";
import { ORIGIN, LOCALES, LANGUAGE_TAG, OG_LOCALE, type SiteLocale } from "@/lib/site";

export function projectsSeo(locale: SiteLocale, project?: MonitorProject) {
  const c = projectsCopy[locale],
    name =
      project === "xid"
        ? "XID / MMM"
        : project === "quantus"
          ? "Quantus / QTC"
          : project === "flyai"
            ? "fly.ai Compute"
            : c.projects;
  const path = `projects${project ? `/${project}` : ""}`,
    url = `${ORIGIN}/${locale}/${path}`;
  const title = `${name} · ${project === "flyai" ? c.compute : project ? c.monitor : c.title} | IOTA Watch`;
  const description = project ? c[project] : c.intro;
  const robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const page = {
    "@context": "https://schema.org",
    "@type": project ? "WebPage" : "CollectionPage",
    name: title,
    description,
    url,
    inLanguage: LANGUAGE_TAG[locale],
    dateModified: "2026-10-06",
    isPartOf: { "@type": "WebSite", name: "IOTA Watch", url: ORIGIN },
    ...(project
      ? {
          about: projectEntity(project),
          citation: [
            PROJECTS[project].website,
            PROJECTS[project].explorer,
            PROJECTS[project].guide,
          ],
        }
      : {
          hasPart: ["xid", "quantus", "flyai"].map((id) => ({
            "@type": "WebPage",
            name: PROJECTS[id as MonitorProject].name,
            url: `${ORIGIN}/${locale}/projects/${id}`,
          })),
        }),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "IOTA Watch", url: `${ORIGIN}/${locale}` },
      { name: c.projects, url: `${ORIGIN}/${locale}/projects` },
      ...(project ? [{ name, url }] : []),
    ].map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })),
  };
  const guides = guidesForProject(project);
  const guideCollection = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${name} · ${c.guide}`,
    itemListElement: guides.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title[locale],
      url: `${ORIGIN}/${locale}/learn/${a.slug}`,
    })),
  };
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
      {
        name: "keywords",
        content:
          project === "xid"
            ? "XID, xCoin, MMM, Mac Metal Miner, MetalDAG, hashrate monitor"
            : project === "quantus"
              ? "Quantus, QTC, QPoW, wormhole, mining rewards"
              : project === "flyai"
                ? "fly.ai, FlyAI Compute, compute points, ETH reward wallet"
                : "IOTA Train at Home, XID, MMM, Quantus, QTC, fly.ai, mining monitor",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "IOTA Watch" },
      { property: "og:locale", content: OG_LOCALE[locale] },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: url },
      ...LOCALES.map((lang) => ({
        rel: "alternate",
        hrefLang: LANGUAGE_TAG[lang],
        href: `${ORIGIN}/${lang}/${path}`,
      })),
      { rel: "alternate", hrefLang: "x-default", href: `${ORIGIN}/en/${path}` },
    ],
    scripts: [page, breadcrumb, guideCollection].map((data) => ({
      type: "application/ld+json" as const,
      children: JSON.stringify(data).replace(/</g, "\u003c"),
    })),
  };
}
