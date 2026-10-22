import { createFileRoute, notFound } from "@tanstack/react-router";
import { PoolWorkerCards } from "@/components/pool-worker-cards";
import { useLocale } from "@/components/site/locale";
import { localized } from "@/lib/product-discovery";
import { useState } from "react";
import { ProjectAddressBookView, type AddressBookEntry } from "@/components/project-address-book";
import { validPoolAddress } from "@/lib/pool-projects";

/** Local visual review: example workers never enter the account or upstream APIs. */
export const Route = createFileRoute("/$locale/review-pools")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: PoolReview,
});

function PoolReview() {
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
