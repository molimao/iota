import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  buildArticleMarkdown,
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemapXml,
} from "./lib/crawl";
import { getBlogPost } from "./components/site/blog-posts";
import { getArticle } from "./components/site/articles";
import { CANONICAL_HOST, detectLocaleFromRequest, originFromRequest, isLocale } from "./lib/site";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function wwwRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname.toLowerCase() !== `www.${CANONICAL_HOST}`) return null;
  url.hostname = CANONICAL_HOST;
  url.protocol = "https:";
  return new Response(null, {
    status: 301,
    headers: {
      Location: url.toString(),
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function crawlAssetResponse(request: Request): Response | null {
  const path = new URL(request.url).pathname;
  const origin = originFromRequest(request);
  const cache = "public, max-age=3600";
  const markdown = path.match(/^\/(zh-TW|en|zh|ko|ja)\/(learn|blog)\/([a-z0-9-]+)\.md$/);
  if (markdown && (request.method === "GET" || request.method === "HEAD")) {
    const section = markdown[2] === "blog" ? "blog" : "learn";
    const article = section === "blog" ? getBlogPost(markdown[3]!) : getArticle(markdown[3]!);
    if (!article)
      return new Response("Guide not found", {
        status: 404,
        headers: { "X-Robots-Tag": "noindex" },
      });
    const locale = markdown[1];
    if (!isLocale(locale)) return new Response("Not found", { status: 404 });
    return new Response(
      request.method === "HEAD" ? null : buildArticleMarkdown(article, locale, origin, section),
      {
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          "cache-control": cache,
          Link: `<${origin}/${locale}/${section}/${article.slug}>; rel="canonical"`,
        },
      },
    );
  }
  if (path === "/sitemap.xml") {
    return new Response(buildSitemapXml(origin), {
      headers: { "content-type": "application/xml; charset=utf-8", "cache-control": cache },
    });
  }
  if (path === "/robots.txt") {
    return new Response(buildRobotsTxt(origin), {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": cache },
    });
  }
  if (path === "/llms.txt") {
    return new Response(buildLlmsTxt(origin), {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": cache },
    });
  }
  if (path === "/llms-full.txt") {
    return new Response(buildLlmsFullTxt(origin), {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": cache },
    });
  }
  return null;
}

function trailingSlashRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${url.pathname.slice(0, -1)}${url.search}`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
  return null;
}

function localeHomeRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.pathname !== "/" && url.pathname !== "/app" && url.pathname !== "/app/") {
    return null;
  }
  const locale = detectLocaleFromRequest(request);
  const location = url.pathname.startsWith("/app") ? `/${locale}/app` : `/${locale}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Cache-Control": "private, no-store",
    },
  });
}

function decorateCrawlHeaders(request: Request, response: Response): Response {
  const path = new URL(request.url).pathname;
  const headers = new Headers(response.headers);
  let changed = false;

  if (response.status === 404) {
    headers.set("X-Robots-Tag", "noindex");
    changed = true;
  }

  if (
    path === "/app" ||
    path === "/app/" ||
    /^\/(zh-TW|en|zh|ko|ja)\/app\/?$/.test(path) ||
    /^\/(zh-TW|en|zh|ko|ja)\/(account|devices|review)\/?$/.test(path)
  ) {
    headers.set("X-Robots-Tag", "noindex, follow");
    changed = true;
  }

  return changed
    ? new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    : response;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (new URL(request.url).pathname === "/api/reports/cron") {
        const { reportCron } = await import("./lib/daily-report-jobs.server");
        return reportCron(request);
      }
      if (new URL(request.url).pathname === "/api/reports/unsubscribe") {
        const { reportUnsubscribe } = await import("./lib/daily-report-unsubscribe.server");
        return reportUnsubscribe(request);
      }
      if (new URL(request.url).pathname === "/api/stripe/webhook") {
        const { stripeWebhook } = await import("./lib/billing.server");
        return stripeWebhook(request);
      }
      const www = wwwRedirect(request);
      if (www) return www;
      const asset = crawlAssetResponse(request);
      if (asset) return asset;
      const slash = trailingSlashRedirect(request);
      if (slash) return slash;
      const redirected = localeHomeRedirect(request);
      if (redirected) return redirected;
      const handler = await getServerEntry();
      const response = await decorateCrawlHeaders(request, await handler.fetch(request, env, ctx));
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
