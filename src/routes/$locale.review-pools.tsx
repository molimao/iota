import { createFileRoute, notFound } from "@tanstack/react-router";
import { PoolWorkerCards } from "@/components/pool-worker-cards";
import { useLocale } from "@/components/site/locale";
import { localized } from "@/lib/product-discovery";
import { useState } from "react";
import { ProjectAddressBookView, type AddressBookEntry } from "@/components/project-address-book";
import { validPoolAddress, type PoolProject } from "@/lib/pool-projects";
import { poolHashrate, type PoolAccount } from "@/lib/pool-monitor";
import { poolCopy } from "@/components/pool-copy";
import { poolWorkerCardsCopy } from "@/components/pool-worker-cards-copy";

/** Local visual review: example workers never enter the account or upstream APIs. */
export const Route = createFileRoute("/$locale/review-pools")({
  validateSearch: (search: Record<string, unknown>) => ({
    project:
      search["project"] === "btc" || search["project"] === "ethw" || search["project"] === "prl"
        ? search["project"]
        : "etc",
  }),
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: PoolReview,
});

const EXAMPLE_BTC = [
  "1BcktgV7EjHmxEwQDFFhhztzNqZkd5gdm",
  "bc1qqszqgpqyqszqgpqyqszqgpqyqszqgpqy5dl506",
] as const;
const EXAMPLE_ETHW = [
  "0x1111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222",
] as const;
const EXAMPLE_PRL = [
  "prl1qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khce6mua7l",
  "prl1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
] as const;
type PreviewCoin = "btc" | "ethw" | "prl";

function exampleAccount(project: PreviewCoin, now: number): PoolAccount {
  if (project === "prl") {
    return {
      balance: 12.45,
      paid: 318.6,
      reward: 1.82,
      period: "utcDay",
      workerCount: 4,
      partial: false,
      hashrate: 86.4e6,
      workers: [
        { name: "pearl-gpu-01", hashrate: 52.1e6, online: true, lastSeen: now - 20_000 },
        {
          name: "pearl-gpu-02",
          hashrate: 34.3e6,
          online: true,
          lastSeen: now - 50_000,
        },
        {
          name: "pearl-gpu-03",
          hashrate: 0,
          online: false,
          lastSeen: now - 3 * 60 * 60 * 1000,
        },
        { name: "pearl-unknown", hashrate: 0, online: null, lastSeen: null },
      ],
    };
  }
  return {
    balance: project === "ethw" ? 0.030595842 : null,
    paid: null,
    reward: project === "ethw" ? 1.25 : null,
    period: project === "ethw" ? "rolling24h" : "unknown",
    workerCount: project === "btc" ? 6 : 4,
    partial: project === "btc",
    hashrate: project === "btc" ? 2.89e12 : 225e6,
    lastShare: now - 30_000,
    ...(project === "btc" ? { hashrateWindow: "1hr" as const } : {}),
    workers: [
      {
        name: project === "btc" ? "bitaxe601-01" : "gpu-01",
        hashrate: project === "btc" ? 1.94e12 : 150e6,
        online: true,
        lastSeen: now - 20_000,
      },
      {
        name: project === "btc" ? "rack-02" : "gpu-02",
        hashrate: project === "btc" ? 954e9 : 75e6,
        online: true,
        lastSeen: now - 50_000,
      },
      { name: "idle-rig", hashrate: 0, online: false, lastSeen: now - 3 * 60 * 60 * 1000 },
      { name: "unknown-rig", hashrate: null, online: null, lastSeen: null },
    ],
  };
}

function PoolReview() {
  const { project } = Route.useSearch();
  return project === "btc" || project === "ethw" || project === "prl" ? (
    <CoinPreview key={project} project={project} />
  ) : (
    <LegacyPoolReview />
  );
}

function LegacyPoolReview() {
  const { locale } = useLocale();
  const title = localized([
    "矿池设备卡片预览",
    "礦池設備卡片預覽",
    "Pool worker preview",
    "풀 워커 미리보기",
    "プールワーカーのプレビュー",
  ]);
  const note = localized([
    "仅供设计预览，以下为演示数据，不会写入账号。",
    "僅供設計預覽，以下為示範資料，不會寫入帳號。",
    "Design preview with example data. Nothing is saved to an account.",
    "예시 데이터로 보는 디자인 미리보기입니다. 계정에 저장되지 않습니다.",
    "サンプルデータによるデザイン確認です。アカウントには保存されません。",
  ]);
  const now = Date.now();
  const [saved, setSaved] = useState<AddressBookEntry[]>(() =>
    ["online", "offline", "unavailable", "wallet"].map((status, i) => ({
      deviceId: `demo-device-${i}`,
      bindingId: `demo-binding-${i}`,
      deviceName: `Saved rig ${i + 1}`,
      identifier: `0x${String(i + 1).repeat(40)}`,
      status: status as AddressBookEntry["status"],
      activity: i === 0 ? "150 MH/s" : "—",
      source: "2Miners · Demo",
      updated: "—",
      today: null,
      unit: "ETC",
    })),
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <main id="main" className="projects-page pool-page">
      <header className="project-heading">
        <h1>{title[locale]}</h1>
        <p>{note[locale]}</p>
      </header>
      <PoolWorkerCards
        project="etc"
        locale={locale}
        address="0x1111111111111111111111111111111111111111"
        account={{
          balance: null,
          paid: null,
          reward: null,
          period: "rolling24h",
          workerCount: 4,
          partial: false,
          hashrate: 225000000,
          workers: [
            { name: "rig-01", hashrate: 150000000, online: true, lastSeen: now - 60000 },
            { name: "rig-02", hashrate: 75000000, online: true, lastSeen: now - 120000 },
            { name: "rig-03", hashrate: 0, online: false, lastSeen: now - 7200000 },
            { name: "rig-04", hashrate: null, online: null, lastSeen: null },
          ],
        }}
      />
      <ProjectAddressBookView
        project="etc"
        locale={locale}
        savedCount={saved.length}
        limit={5}
        cards={saved}
        query={query}
        statusFilter={statusFilter}
        editingId={editingId}
        draft={draft}
        raw={raw}
        onRaw={setRaw}
        error={error}
        onAdd={() => {
          const ids = raw
            .split(/\r?\n/)
            .map((id) => id.trim())
            .filter(Boolean);
          if (
            !ids.length ||
            ids.some(
              (id) => !validPoolAddress("etc", id) || saved.some((card) => card.identifier === id),
            ) ||
            new Set(ids).size !== ids.length ||
            saved.length + ids.length > 5
          ) {
            setError(
              localized([
                "请检查地址、重复项和剩余名额。",
                "請檢查地址、重複項與剩餘名額。",
                "Check addresses, duplicates and available slots.",
                "주소, 중복 및 남은 한도를 확인하세요.",
                "アドレス、重複、残り枠を確認してください。",
              ])[locale],
            );
            return;
          }
          setSaved((old) => [
            ...old,
            ...ids.map((identifier) => ({
              identifier,
              deviceId: `demo-${identifier}`,
              bindingId: `demo-${identifier}`,
              deviceName: "Demo rig",
              status: "unavailable" as const,
              activity: "—",
              source: "2Miners · Demo",
              updated: "—",
              today: null,
              unit: "ETC",
            })),
          ]);
          setRaw("");
          setError(null);
        }}
        onQuery={setQuery}
        onStatus={setStatusFilter}
        onClear={() => {
          setQuery("");
          setStatusFilter("all");
        }}
        onStartRename={(id, name) => {
          setEditingId(id);
          setDraft(name);
        }}
        onDraft={setDraft}
        onSaveRename={(id) => {
          setSaved((old) =>
            old.map((card) =>
              card.deviceId === id ? { ...card, deviceName: draft.trim() } : card,
            ),
          );
          setEditingId(null);
        }}
        onCancelRename={() => setEditingId(null)}
        onRemove={(_, bindingId) =>
          setSaved((old) => old.filter((card) => card.bindingId !== bindingId))
        }
      />
    </main>
  );
}

const PREVIEW: Record<
  PreviewCoin,
  {
    title: string;
    source: string;
    unit: string;
    activity: string;
    samples: readonly [string, string];
  }
> = {
  btc: {
    title: "Bitcoin · CKPool",
    source: "CKPool · example",
    unit: "BTC",
    activity: "2.89 TH/s",
    samples: EXAMPLE_BTC,
  },
  ethw: {
    title: "EthereumPoW · 2Miners",
    source: "2Miners · example",
    unit: "ETHW",
    activity: "225 MH/s",
    samples: EXAMPLE_ETHW,
  },
  prl: {
    title: "Pearl · Kryptex",
    source: "Kryptex · example",
    unit: "PRL",
    activity: "86.4 MH/s",
    samples: EXAMPLE_PRL,
  },
};

function CoinPreview({ project }: { project: PreviewCoin }) {
  const { locale } = useLocale();
  const now = Date.parse("2026-10-23T11:00:00Z");
  const preview = PREVIEW[project];
  const samples = preview.samples;
  const [saved, setSaved] = useState<AddressBookEntry[]>(() =>
    samples.map((identifier, i) => ({
      deviceId: `demo-${project}-${i}`,
      bindingId: `bind-${project}-${i}`,
      deviceName: i === 0 ? "Main wallet" : "Second wallet",
      identifier,
      status: i === 0 ? "online" : "offline",
      activity: i === 0 ? preview.activity : "—",
      source: preview.source,
      updated: "—",
      today: null,
      unit: preview.unit,
    })),
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const note = localized([
    "本地示例，不是上游实况，也不会写入账号。",
    "本地示例，不是上游實況，也不會寫入帳號。",
    "Local example data, not a live upstream reading, and nothing is saved.",
    "로컬 예시이며 실시간 업스트림이 아니고 계정에 저장되지 않습니다.",
    "ローカルの例であり、上流の実況ではなく、アカウントにも保存しません。",
  ]);
  const account = exampleAccount(project, now);
  const amount = (n: number | null) =>
    n == null ? "—" : n.toLocaleString(locale, { maximumFractionDigits: 8 });
  return (
    <main id="main" className="projects-page pool-page" style={{ overflowX: "hidden" }}>
      <header className="project-heading">
        <h1>{preview.title}</h1>
        <p>{note[locale]}</p>
      </header>
      <section className="pool-results">
        <div className="pool-metrics">
          <div>
            <span>{poolCopy.rate[locale]}</span>
            <strong>{poolHashrate(project, account.hashrate)}</strong>
          </div>
          {project === "ethw" &&
            (
              [
                [poolCopy.balance[locale], account.balance],
                [poolCopy.rolling24h[locale], account.reward],
                [poolCopy.paid[locale], account.paid],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{amount(value)} ETHW</strong>
              </div>
            ))}
          {project === "prl" &&
            (
              [
                [poolCopy.balance[locale], account.balance],
                [poolCopy.utcDay[locale], account.reward],
                [poolCopy.paid[locale], account.paid],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>
                  {amount(value)} {preview.unit}
                </strong>
              </div>
            ))}
        </div>
        {project === "btc" && (
          <>
            <p className="compute-caption">{poolCopy.ckpoolWindow[locale]}</p>
            <p className="compute-caption">{poolCopy.ckpoolEarnings[locale]}</p>
            <p className="compute-caption">
              {poolWorkerCardsCopy.lastShare[locale]}{" "}
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "short",
                timeStyle: "medium",
                timeZone: "Asia/Hong_Kong",
              }).format(account.lastShare!)}{" "}
              · UTC+8
            </p>
          </>
        )}
        {project !== "btc" && (
          <p className="compute-caption">
            {poolCopy.scope[locale]} {account.partial ? poolCopy.partial[locale] : ""}
          </p>
        )}
      </section>
      <PoolWorkerCards
        project={project}
        locale={locale}
        now={now}
        address={samples[0]}
        account={account}
      />
      <ProjectAddressBookView
        project={project as PoolProject}
        locale={locale}
        savedCount={saved.length}
        limit={5}
        cards={saved}
        query={query}
        statusFilter={statusFilter}
        editingId={editingId}
        draft={draft}
        raw={raw}
        onRaw={setRaw}
        error={error}
        onAdd={() => {
          const ids = raw
            .split(/\r?\n/)
            .map((id) => id.trim())
            .filter(Boolean);
          if (
            !ids.length ||
            ids.some(
              (id) =>
                !validPoolAddress(project, id) || saved.some((card) => card.identifier === id),
            ) ||
            new Set(ids).size !== ids.length ||
            saved.length + ids.length > 5
          ) {
            setError(note[locale]);
            return;
          }
          setSaved((old) => [
            ...old,
            ...ids.map((identifier) => ({
              identifier,
              deviceId: `demo-${identifier}`,
              bindingId: `demo-${identifier}`,
              deviceName: "Example wallet",
              status: "unavailable" as const,
              activity: "—",
              source: "example",
              updated: "—",
              today: null,
              unit: preview.unit,
            })),
          ]);
          setRaw("");
          setError(null);
        }}
        onQuery={setQuery}
        onStatus={setStatusFilter}
        onClear={() => {
          setQuery("");
          setStatusFilter("all");
        }}
        onStartRename={(id, name) => {
          setEditingId(id);
          setDraft(name);
        }}
        onDraft={setDraft}
        onSaveRename={(id) => {
          setSaved((old) =>
            old.map((card) =>
              card.deviceId === id ? { ...card, deviceName: draft.trim() } : card,
            ),
          );
          setEditingId(null);
        }}
        onCancelRename={() => setEditingId(null)}
        onRemove={(_, bindingId) =>
          setSaved((old) => old.filter((card) => card.bindingId !== bindingId))
        }
      />
    </main>
  );
}
