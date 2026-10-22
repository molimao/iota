import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LOCALES, type SiteLocale } from "@/lib/site";
import type { PoolAccount, PoolWorker } from "@/lib/pool-monitor";
import { PoolWorkerCards, workerStatus } from "./pool-worker-cards";
import { poolWorkerCardsCopy as copy } from "./pool-worker-cards-copy";

const css = readFileSync(new URL("./pool-worker-cards.css", import.meta.url), "utf8");

const address = "0x1111111111111111111111111111111111111111";
const now = Date.parse("2026-10-22T00:00:00Z");

it("keeps an out-of-range upstream timestamp from breaking the worker view", () => {
  const html = render([worker({ name: "bad-clock", lastSeen: 1e300, online: null })]);
  expect(article(html, "bad-clock")).toContain("未知");
});

function worker(partial: Partial<PoolWorker> & Pick<PoolWorker, "name">): PoolWorker {
  return { hashrate: 1_500_000, online: true, lastSeen: now - 60_000, ...partial };
}

function account(workers: PoolWorker[], extra: Partial<PoolAccount> = {}): PoolAccount {
  return {
    balance: 1.5,
    paid: 8,
    reward: 0.2,
    period: "rolling24h",
    workers,
    workerCount: extra.workerCount ?? workers.length,
    partial: false,
    hashrate: 1_500_000,
    ...extra,
  };
}

function render(
  workers: PoolWorker[],
  props: {
    locale?: SiteLocale;
    query?: string;
    status?: "all" | "online" | "offline" | "unknown";
    layout?: "cards" | "list";
    page?: number;
    account?: Partial<PoolAccount>;
  } = {},
) {
  return renderToStaticMarkup(
    createElement(PoolWorkerCards, {
      project: "etc",
      address,
      account: account(workers, props.account),
      locale: props.locale ?? "zh",
      now,
      ...(props.query !== undefined ? { query: props.query } : {}),
      ...(props.status !== undefined ? { status: props.status } : {}),
      ...(props.layout !== undefined ? { layout: props.layout } : {}),
      ...(props.page !== undefined ? { page: props.page } : {}),
    }),
  );
}

function article(html: string, name: string) {
  const start = html.indexOf(`data-worker="${name}"`);
  expect(start).toBeGreaterThan(-1);
  const end = html.indexOf("</article>", start);
  return html.slice(start, end);
}

it("shows workers as cards under one payout address", () => {
  const html = render([
    worker({ name: "rig-a" }),
    worker({ name: "rig-b", online: false, hashrate: 0 }),
  ]);
  expect(html).not.toContain("<details");
  expect(html).not.toContain("<summary");
  expect(html).not.toContain("<svg");
  expect(html).not.toContain("昨日");
  expect(html).toContain(address);
  expect(html).toContain("收益账户");
  expect(html).toContain("不会自动加入设备");
  expect(html).toContain("也不占用设备名额");
  expect(html).toContain('data-layout="cards"');
  expect(html).toContain('data-worker="rig-a"');
  expect(html).toContain('data-worker="rig-b"');
  expect(article(html, "rig-a")).toContain('data-state="online"');
  expect(article(html, "rig-b")).toContain('data-state="offline"');
  expect(html).toContain('data-status="all" data-count="2"');
  expect(html).toContain("1.5 MH/s");
  expect(html).toContain("0 H/s");
});

it("searches by name and filters status without shrinking the full counts", () => {
  const workers = [
    worker({ name: "alpha" }),
    worker({ name: "beta", online: false }),
    worker({ name: "gamma", online: null, hashrate: null, lastSeen: null }),
  ];
  const searched = render(workers, { query: "beta" });
  expect(searched).toContain('data-worker="beta"');
  expect(searched).not.toContain('data-worker="alpha"');
  expect(searched).not.toContain('data-worker="gamma"');
  expect(searched).toContain('data-status="all" data-count="3"');
  expect(searched).toContain('data-status="online" data-count="1"');
  expect(searched).toContain('data-status="offline" data-count="1"');
  expect(searched).toContain('data-status="unknown" data-count="1"');

  const onlineOnly = render(workers, { status: "online" });
  expect(onlineOnly).toContain('data-worker="alpha"');
  expect(onlineOnly).not.toContain('data-worker="beta"');
  expect(onlineOnly).not.toContain('data-worker="gamma"');

  const empty = render(workers, { query: "missing-name" });
  expect(empty).toContain("没有符合当前搜索或筛选的 Worker。");
  expect(empty).toContain("清除条件");
  expect(empty).not.toContain('data-worker="alpha"');
  expect(empty).toContain('data-count="3"');
});

it("keeps a null worker unknown instead of online or zero", () => {
  expect(workerStatus(null)).toBe("unknown");
  expect(workerStatus(false)).toBe("offline");
  const html = render([worker({ name: "blank", online: null, hashrate: null, lastSeen: null })], {
    layout: "list",
  });
  const card = article(html, "blank");
  expect(html).toContain('data-layout="list"');
  expect(card).toContain('data-state="unknown"');
  expect(card).not.toContain('data-state="online"');
  expect(card).not.toContain('data-state="offline"');
  expect(card).toContain("未知");
  expect(card).not.toContain("0 H/s");
  expect(card).not.toContain("0 S/s");
  expect(html).toContain('data-status="unknown" data-count="1"');
  expect(html).toContain('data-status="online" data-count="0"');
});

it("does not treat a future or stale timestamp as a status", () => {
  const html = render([
    worker({ name: "ahead", online: null, hashrate: null, lastSeen: now + 86_400_000 }),
    worker({ name: "old", online: null, hashrate: 2_000, lastSeen: now - 10 * 86_400_000 }),
  ]);
  const ahead = article(html, "ahead");
  const old = article(html, "old");
  expect(ahead).toContain('data-state="unknown"');
  expect(ahead).toContain("报告时间晚于现在");
  expect(ahead).not.toContain('data-state="online"');
  expect(old).toContain('data-state="unknown"');
  expect(old).toContain("报告时间较早");
  expect(old).not.toContain('data-state="offline"');
  expect(old).toContain("2 KH/s");
});

it("pages 100 cards and states when the pool list is short", () => {
  const workers = Array.from({ length: 101 }, (_, index) =>
    worker({ name: `rig-${index}`, online: index % 2 === 0 }),
  );
  const first = render(workers);
  const second = render(workers, { page: 2 });
  expect(first).toContain('data-worker="rig-0"');
  expect(first).not.toContain('data-worker="rig-100"');
  expect(first).toContain("显示 1–100 / 101");
  expect(first).toContain('data-status="all" data-count="101"');
  expect(second).toContain('data-worker="rig-100"');
  expect(second).not.toContain('data-worker="rig-0"');
  expect(second).toContain("显示 101–101 / 101");
  const partial = render([], { account: { workerCount: 4, partial: true } });
  expect(partial).toContain("矿池报告有 Worker，但这次没有取回名单");
  expect(partial).toContain("矿池共报告 4 个 Worker");
  expect(partial).not.toContain("当前矿池没有找到这个地址");
});

it("uses natural copy in five locales and keeps 390px controls in a row", () => {
  for (const locale of LOCALES) {
    const html = render([worker({ name: "rig-a", online: null, hashrate: null, lastSeen: null })], {
      locale,
    });
    expect(html).toContain(copy.account[locale]);
    expect(html).toContain(copy.accountNote[locale]);
    expect(html).toContain(copy.unknown[locale]);
    expect(html).not.toMatch(/免费|免費|무료|無料|\bFree\b/);
    expect(html).not.toContain("昨日");
  }
  const sample = render([worker({ name: "a-very-long-worker-name" })]);
  expect(sample).toContain('class="pwc-address"');
  expect(sample).toContain('class="pwc-name"');
  expect(sample).toContain('class="pwc-filters"');
  expect(sample).toContain('class="pwc-layout"');
  const mobile = css.slice(css.indexOf("@media (max-width: 390px)"));
  expect(mobile.startsWith("@media (max-width: 390px)")).toBe(true);
  expect(mobile).toContain("flex-direction: row");
  expect(mobile).toContain("flex-wrap: wrap");
  expect(mobile).toContain("overflow-wrap: anywhere");
  expect(mobile).toContain("word-break: break-word");
  expect(mobile).toContain("minmax(0, 1fr)");
  expect(mobile).toContain(".pwc-filters button");
  expect(mobile).toContain("width: auto");
  expect(mobile).not.toContain("flex-direction: column");
  expect(css).toContain('.pwc-state[data-state="online"]');
  expect(css).toContain('.pwc-state[data-state="offline"]');
  expect(css).toContain('.pwc-state[data-state="unknown"]');
  expect(css).not.toMatch(/\.pwc-filters[^{]*\{[^}]*flex-direction:\s*column/);
});
