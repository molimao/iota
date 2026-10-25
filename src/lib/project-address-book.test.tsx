import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LOCALES, type SiteLocale } from "@/lib/site";
import type { FleetProject } from "@/lib/fleet";
import { isPoolProject } from "@/lib/pool-projects";
import { fleetCopy } from "@/components/fleet-copy";
import { addressBookCopy as copy } from "@/components/project-address-book-copy";
import {
  ProjectAddressBookView,
  addressStatusTone,
  countAddressStatuses,
  filterAddressCards,
  renameDevice,
  unlinkBinding,
  type AddressBookEntry,
} from "@/components/project-address-book";
const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../components/project-address-book.css"),
  "utf8",
);

const longId = "0x1111111111111111111111111111111111111111";

function entry(
  partial: Pick<AddressBookEntry, "deviceName" | "identifier" | "status"> &
    Partial<Pick<AddressBookEntry, "deviceId" | "bindingId">>,
): AddressBookEntry {
  return {
    deviceId: partial.deviceId ?? `device-${partial.deviceName}`,
    deviceName: partial.deviceName,
    bindingId: partial.bindingId ?? `binding-${partial.deviceName}`,
    identifier: partial.identifier,
    status: partial.status,
    activity: "activity",
    source: "source",
    updated: "just now",
    today: null,
    unit: "unit",
  };
}

function render(props: {
  project: FleetProject;
  cards: readonly AddressBookEntry[];
  locale?: SiteLocale;
  savedCount?: number;
  limit?: number;
  query?: string;
  statusFilter?: string;
  selected?: string;
  editingId?: string | null;
  draft?: string;
  renaming?: boolean;
  renameError?: string | null;
}) {
  return renderToStaticMarkup(
    createElement(ProjectAddressBookView, {
      project: props.project,
      cards: props.cards,
      savedCount: props.savedCount ?? props.cards.length,
      limit: props.limit ?? 5,
      locale: props.locale ?? "zh",
      ...(props.query !== undefined ? { query: props.query } : {}),
      ...(props.statusFilter !== undefined ? { statusFilter: props.statusFilter } : {}),
      ...(props.selected !== undefined ? { selected: props.selected } : {}),
      ...(props.editingId !== undefined ? { editingId: props.editingId } : {}),
      ...(props.draft !== undefined ? { draft: props.draft } : {}),
      ...(props.renaming !== undefined ? { renaming: props.renaming } : {}),
      ...(props.renameError !== undefined ? { renameError: props.renameError } : {}),
    }),
  );
}

function article(html: string, bindingId: string) {
  const start = html.indexOf(`data-binding="${bindingId}"`);
  expect(start).toBeGreaterThan(-1);
  const end = html.indexOf("</article>", start);
  return html.slice(start, end);
}

const cards = [
  entry({ deviceName: "Alpha", identifier: "0xAbC111", status: "online" }),
  entry({ deviceName: "Beta", identifier: longId, status: "unavailable" }),
  entry({ deviceName: "Gamma", identifier: "addr-gamma", status: "offline" }),
];

it("filters by name or address and counts real statuses without touching selection or quota", () => {
  const selected = "0xAbC111";
  const quota = { saved: cards.length, limit: 5 };
  expect(filterAddressCards(cards, "beta", "all").map((card) => card.deviceName)).toEqual(["Beta"]);
  expect(filterAddressCards(cards, "0xabc", "all").map((card) => card.deviceName)).toEqual([
    "Alpha",
  ]);
  expect(filterAddressCards(cards, "", "offline").map((card) => card.deviceName)).toEqual([
    "Gamma",
  ]);
  expect(filterAddressCards(cards, "gamma", "online")).toEqual([]);
  expect(filterAddressCards(cards, "missing", "all")).toEqual([]);
  expect(cards).toHaveLength(3);
  expect(selected).toBe("0xAbC111");
  expect(quota).toEqual({ saved: 3, limit: 5 });
  expect(countAddressStatuses(cards)).toEqual({ online: 1, unavailable: 1, offline: 1 });
  expect(addressStatusTone("unavailable")).toBe("unknown");
  expect(addressStatusTone("notReported")).toBe("unknown");
  expect(addressStatusTone("loading")).toBe("unknown");
  expect(addressStatusTone("wallet")).toBe("unknown");
  expect(addressStatusTone("not-a-status")).toBe("unknown");
  expect(addressStatusTone("online")).toBe("active");
  expect(addressStatusTone("mining")).toBe("active");
  expect(addressStatusTone("waiting")).toBe("waiting");
  expect(addressStatusTone("offline")).toBe("attention");
  expect(unlinkBinding("device-1", "binding-1")).toEqual({
    action: "unlink",
    payload: { id: "device-1", bindingId: "binding-1" },
  });
  expect(unlinkBinding("device-1", "binding-1").action).not.toBe("remove");
  expect(renameDevice("device-1", "  Shared rig  ", "mac")).toEqual({
    action: "rename",
    payload: { id: "device-1", name: "Shared rig", hardware: "mac" },
  });
});

it("renders unlink on a non-pool project and keeps unknown off the active tone", () => {
  expect(isPoolProject("flyai")).toBe(false);
  expect(isPoolProject("etc")).toBe(true);
  for (const project of ["flyai", "etc"] as const) {
    const html = render({
      project,
      cards,
      savedCount: 3,
      limit: 5,
      query: "beta",
      selected: "0xAbC111",
    });
    expect(html).toContain(`data-project="${project}"`);
    expect(html).toContain('data-action="unlink"');
    expect(html).not.toContain('data-action="remove"');
    expect(html).toContain(copy.remove.zh);
    expect(html).toContain(copy.removeConfirm.zh);
    expect(html).toContain('data-selected="');
    expect(html).toContain(longId);
    expect(html).toContain('data-quota="3"');
    expect(html).toContain("3 / 5");
    expect(html).toContain('data-status="all" data-count="3"');
    expect(html).toContain('data-status="unavailable" data-count="1"');
    expect(html).toContain('data-status="online" data-count="1"');
    expect(html).toContain('data-binding="binding-Beta"');
    expect(html).not.toContain('data-binding="binding-Alpha"');
    expect(html).not.toContain('data-binding="binding-Gamma"');
    const card = article(html, "binding-Beta");
    expect(card).toContain('data-state="unavailable"');
    expect(card).toContain('data-tone="unknown"');
    expect(card).not.toContain('data-tone="active"');
    expect(card).toContain(fleetCopy("zh").unavailable);
    expect(card).not.toContain(fleetCopy("zh").online);
  }
  const empty = render({ project: "flyai", cards, query: "missing-name" });
  expect(empty).toContain(copy.empty.zh);
  expect(empty).toContain(copy.clear.zh);
  expect(empty).not.toContain('data-binding="binding-Alpha"');
  expect(empty).toContain('data-quota="3"');
  expect(empty).toContain('data-count="3"');
  const saving = render({
    project: "flyai",
    cards: [cards[0]!],
    editingId: "device-Alpha",
    draft: "Alpha",
    renaming: true,
    renameError: copy.saveError.zh,
  });
  expect(saving).toContain(copy.saving.zh);
  expect(saving).toContain(copy.renameNote.zh);
  expect(saving).toContain(copy.saveError.zh);
  expect(saving).toContain('role="status"');
  expect(saving).toContain('role="alert"');
});

it("states unlink and rename limits in five locales and keeps 390px controls in a row", () => {
  const confirmSnippets = {
    zh: ["只移除", "不会停止矿工", "不会删除钱包", "其他项目"],
    "zh-TW": ["只移除", "不會停止礦工", "不會刪除錢包", "其他專案"],
    en: ["only removes", "does not stop the miner", "delete the wallet", "other projects"],
    ko: ["연결만 제거", "채굴기를 중지", "지갑을 삭제", "다른 프로젝트"],
    ja: ["関連付けだけ", "マイナーは停止せず", "ウォレットは削除せず", "他のプロジェクト"],
  } as const;
  const renameSnippets = {
    zh: ["设备名称会同步", "其他项目"],
    "zh-TW": ["設備名稱會同步", "其他專案"],
    en: ["syncs the device name", "Other projects that share this device"],
    ko: ["기기 이름이 동기화", "다른 프로젝트"],
    ja: ["デバイス名が同期", "他のプロジェクト"],
  } as const;
  for (const locale of LOCALES) {
    const html = render({
      project: "flyai",
      cards: [cards[1]!],
      locale,
      editingId: "device-Beta",
      draft: "Beta",
    });
    expect(html).toContain(copy.remove[locale]);
    expect(html).toContain(copy.removeConfirm[locale]);
    expect(html).toContain(copy.renameNote[locale]);
    expect(html).toContain('data-action="unlink"');
    expect(html).not.toMatch(/免费|免費|무료|無料|\bFree\b/);
    for (const snippet of confirmSnippets[locale])
      expect(copy.removeConfirm[locale]).toContain(snippet);
    for (const snippet of renameSnippets[locale])
      expect(copy.renameNote[locale]).toContain(snippet);
  }
  const sample = render({ project: "flyai", cards });
  expect(sample).toContain('class="pab-id platform-public-id"');
  expect(sample).toContain('class="pab-name"');
  expect(sample).toContain('class="pab-filters"');
  expect(sample).toContain('class="pab-actions pool-card-actions"');
  const mobile = css.slice(css.indexOf("@media (max-width: 390px)"));
  expect(mobile.startsWith("@media (max-width: 390px)")).toBe(true);
  expect(mobile).toContain("flex-direction: row");
  expect(mobile).toContain("flex-wrap: wrap");
  expect(mobile).toContain("overflow-wrap: anywhere");
  expect(mobile).toContain("word-break: break-word");
  expect(mobile).toContain("minmax(0, 1fr)");
  expect(mobile).toContain(".pab-filters button");
  expect(mobile).toContain("width: auto");
  expect(mobile).not.toContain("flex-direction: column");
  const unknown = css.slice(css.indexOf('.pab-state[data-tone="unknown"]'));
  const unknownBlock = unknown.slice(0, unknown.indexOf("}"));
  expect(unknownBlock).toContain("#d9d0b8");
  expect(unknownBlock).not.toContain("#78dfb3");
  expect(css).toContain('.pab-state[data-tone="active"]');
  expect(css).toContain("#78dfb3");
});

it("keeps Acurast rewards and processors in one address panel without redundant tools", () => {
  const card: AddressBookEntry = {
    ...entry({ deviceName: "Acurast manager", identifier: longId, status: "online" }),
    acurastRewards: {
      dayStart: 1792857600000,
      observedAt: 1792900000000,
      blockHash: "block",
      managers: [
        {
          id: "67279",
          today: "0.336517913898",
          yesterday: "0.54636809281",
          cumulative: "5.236030884927",
        },
      ],
    },
    acurast: {
      role: "manager",
      managerIds: ["67279"],
      complete: true,
      processors: [
        {
          id: "5GP4RwiW81Pxo47eFpGdEnNUsGyjE9HehcqqQT28KbyW7Kek",
          lastSeen: 1792900000000,
          online: false,
        },
      ],
    },
  };
  const html = render({ project: "acurast", cards: [card] });
  expect(html.match(/<h3>ACU 已到账奖励/g)).toHaveLength(1);
  expect(html).toContain("关联设备");
  expect(html).toContain('data-state="older"');
  expect(html).not.toContain('class="pab-tools"');
  expect(html).toContain('<details class="pab-add-drawer">');
  expect(html).not.toContain('class="acu-exact"');
  expect(html).not.toContain("不会停止矿工");
  expect(html).toContain("改名");
  expect(html).toContain('data-action="unlink"');
});

it("shows fly.ai monthly wallet points once with collapsed address tools",()=>{
 const html=render({project:"flyai",cards:[{...entry({deviceName:"mac",identifier:longId,status:"wallet"}),today:"100",activity:"100 points",flyai:{month:"2026-10",points:100,share:.1,rank:2,wallets:20},accountSummary:{kind:"month",amount:"100",unit:""}}]});
 expect(html.match(/class="fly-points"/g)).toHaveLength(1);
 expect(html).not.toContain('class="pab-tools"');expect(html).toContain('<details class="pab-add-drawer">');expect(html).toContain("2026-10");expect(html).toContain("#2");expect(html).toContain('data-action="unlink"');
});
