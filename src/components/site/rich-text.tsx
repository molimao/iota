import type { ReactNode } from "react";
import type { Locale } from "./locale";

function localizeHref(href: string, locale: Locale) {
  if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) return href;
  if (/^\/(zh-TW|en|zh|ko|ja)(\/|$)/.test(href)) {
    return href;
  }
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function renderInline(text: string, locale: Locale): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key++}>{token.slice(1, -1)}</code>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link?.[1] && link[2]) {
        const href = localizeHref(link[2], locale);
        const external = /^https?:\/\//.test(href);
        nodes.push(
          <a key={key++} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
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

  const expanded = blocks.flatMap((block, blockIndex) =>
    (block.trimStart().startsWith("|")
      ? block.split("\n").filter((line) => line.trim())
      : [block]
    ).map((text) => ({ text, blockIndex })),
  );
  const content = expanded.map((block) => block.text);
  for (let i = 0; i < content.length; i++) {
    const block = content[i]!;
    if (block.startsWith("- ")) {
      list.push(block.slice(2));
      continue;
    }
    flush();
    if (block.trimStart().startsWith("|") && /^\s*\|\s*:?-{3,}/.test(content[i + 1] ?? "")) {
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim());
      const headers = cells(block);
      const rows: string[][] = [];
      i += 2;
      while (i < content.length && content[i]!.trimStart().startsWith("|")) {
        rows.push(cells(content[i]!));
        i++;
      }
      i--;
      out.push(
        <div className="article-comparison" key={`table-${i}`} tabIndex={0}>
          <table>
            <thead>
              <tr>
                {headers.map((header, n) => (
                  <th scope="col" key={n}>
                    <RichText text={header} locale={locale} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, n) => (
                <tr key={n}>
                  {headers.map((_, column) => (
                    <td key={column}>
                      <RichText text={row[column] ?? ""} locale={locale} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (block.startsWith("## ")) {
      out.push(
        <h2 id={`section-${expanded[i]!.blockIndex}`} key={`h-${i}`}>
          {block.slice(3)}
        </h2>,
      );
      continue;
    }
    if (block.startsWith("> ")) {
      out.push(
        <aside className="article-callout" key={`n-${i}`}>
          <RichText text={block.slice(2)} locale={locale} />
        </aside>,
      );
      continue;
    }
    out.push(
      <p key={`p-${i}`}>
        <RichText text={block} locale={locale} />
      </p>,
    );
  }
  flush();
  return <>{out}</>;
}
