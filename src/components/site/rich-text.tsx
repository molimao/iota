import type { ReactNode } from "react";
import type { Locale } from "./locale";

function localizeHref(href: string, locale: Locale) {
  if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) return href;
  if (href.startsWith("/en/") || href.startsWith("/zh/") || href === "/en" || href === "/zh") {
    return href;
  }
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function renderInline(text: string, locale: Locale): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link?.[1] && link[2]) {
        const href = localizeHref(link[2], locale);
        const external = /^https?:\/\//.test(href);
        nodes.push(
          <a
            key={key++}
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {link[1]}
          </a>,
        );
      }
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RichText({ text, locale }: { text: string; locale: Locale }) {
  return <>{renderInline(text, locale)}</>;
}

export function ArticleBlocks({ blocks, locale }: { blocks: string[]; locale: Locale }) {
  const out: ReactNode[] = [];
  let list: string[] = [];

  const flush = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`}>
        {list.map((item) => (
          <li key={item}>
            <RichText text={item} locale={locale} />
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  blocks.forEach((block, i) => {
    if (block.startsWith("- ")) {
      list.push(block.slice(2));
      return;
    }
    flush();
    if (block.startsWith("## ")) {
      out.push(<h2 key={`h-${i}`}>{block.slice(3)}</h2>);
      return;
    }
    if (block.startsWith("> ")) {
      out.push(
        <aside className="article-callout" key={`n-${i}`}>
          <RichText text={block.slice(2)} locale={locale} />
        </aside>,
      );
      return;
    }
    out.push(
      <p key={`p-${i}`}>
        <RichText text={block} locale={locale} />
      </p>,
    );
  });
  flush();
  return <>{out}</>;
}
