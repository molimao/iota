import { projectsCopy } from "./projects-copy";
import { PROJECTS, type MiningProject } from "@/lib/projects";
import { ORIGIN, LOCALES, LANGUAGE_TAG, OG_LOCALE, type SiteLocale } from "@/lib/site";

export function projectsSeo(locale: SiteLocale, project?: MiningProject) {
  const c = projectsCopy[locale],
    name = project === "xid" ? "XID / MMM" : project === "quantus" ? "Quantus / QTC" : c.projects;
  const path = `projects${project ? `/${project}` : ""}`,
    url = `${ORIGIN}/${locale}/${path}`;
  const title = `${name} · ${project ? c.monitor : c.title} | IOTA Watch`;
  const description = project ? c[project] : c.intro;
  const robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const page = {
    "@context": "https://schema.org",
    "@type": project ? "WebPage" : "CollectionPage",
    name: title,
    description,
    url,
    inLanguage: LANGUAGE_TAG[locale],
    dateModified: "2026-10-03",
    isPartOf: { "@type": "WebSite", name: "IOTA Watch", url: ORIGIN },
    ...(project
      ? {
          about: { "@type": "Thing", name, sameAs: PROJECTS[project].website },
          citation: [
            PROJECTS[project].website,
            PROJECTS[project].explorer,
            PROJECTS[project].guide,
          ],
        }
      : {
          hasPart: ["xid", "quantus"].map((id) => ({
            "@type": "WebPage",
            name: PROJECTS[id as MiningProject].name,
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
              : "IOTA Train at Home, XID, MMM, Quantus, QTC, mining monitor",
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
    scripts: [page, breadcrumb].map((data) => ({
      type: "application/ld+json" as const,
      children: JSON.stringify(data).replace(/</g, "\\u003c"),
    })),
  };
}
