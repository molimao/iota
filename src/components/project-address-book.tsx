import { isPoolProject, poolName, poolProvider } from "@/lib/pool-projects";
import { poolCopy } from "./pool-copy";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { useFleetReadings } from "@/hooks/use-fleet-readings";
import { FLEET_NAMES, type FleetProject } from "@/lib/fleet";
import { projectAddressInput } from "@/lib/project-address-input";
import { localized } from "@/lib/product-discovery";
import { additionalMetricCopy } from "./additional-platform-copy";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";
const copy = {
  title: localized(["已保存设备", "已儲存設備", "Saved devices", "저장된 기기", "保存済み機器"]),
  input: localized([
    "公开地址或 ID（每行一个）",
    "公開地址或 ID（每行一個）",
    "Public addresses or IDs, one per line",
    "공개 주소 또는 ID · 한 줄에 하나",
    "公開アドレス・ID（1行に1つ）",
  ]),
  add: localized(["添加并保存", "新增並儲存", "Add and save", "추가 및 저장", "追加して保存"]),
  sync: localized([
    "保存在账号中，与“我的设备”同步。",
    "儲存於帳號，與「我的設備」同步。",
    "Saved to your account and shared with My devices.",
    "계정에 저장되며 내 기기와 동기화됩니다.",
    "アカウントに保存し、マイデバイスと共有します。",
  ]),
  login: localized([
    "登录后保存多个地址",
    "登入後儲存多個地址",
    "Sign in to save multiple addresses",
    "로그인하고 여러 주소 저장",
    "ログインして複数アドレスを保存",
  ]),
  detail: localized(["查看详情", "查看詳情", "View details", "상세 보기", "詳細を見る"]),
  batch: localized([
    "无效或重复地址，请检查后再提交。",
    "地址無效或重複，請檢查後提交。",
    "Check invalid or duplicate addresses before saving.",
    "잘못되거나 중복된 주소를 확인하세요.",
    "無効・重複アドレスを確認してください。",
  ]),
};
export function ProjectAddressBook({
  project,
  onSelect,
}: {
  project: FleetProject;
  onSelect?: (id: string) => void;
}) {
  const auth = useAuth(),
    fleet = useFleet(auth.userId, auth.ready),
    { locale } = useLocale(),
    c = fleetCopy(locale);
  const devices = useMemo(
    () =>
      (auth.userId ? fleet.devices : [])
        .map((d) => ({ ...d, bindings: d.bindings.filter((b) => b.project === project) }))
        .filter((d) => d.bindings.length),
    [fleet.devices, project, auth.userId],
  );
  const read = useFleetReadings(devices, fleet.ready);
  const [raw, setRaw] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    const next =
      devices.flatMap((d) => d.bindings).find((b) => b.identifier === selected) ??
      devices[0]?.bindings[0];
    if (fleet.ready && next && next.identifier !== selected) {
      setSelected(next.identifier);
      onSelect?.(next.identifier);
    }
    if (fleet.ready && !next && selected) {
      setSelected("");
      onSelect?.("");
    }
  }, [devices, fleet.ready, selected, onSelect]);
  const saving = useRef(false);
  async function add() {
    if (!auth.userId || !fleet.ready || saving.current) return;
    let ids: string[];
    try {
      ids = projectAddressInput(
        project,
        raw,
        devices.flatMap((d) => d.bindings.map((b) => b.identifier)),
        fleet.limit - devices.length,
      );
    } catch (e) {
      setError(e instanceof Error && e.message === "quota" ? c.limit : copy.batch[locale]);
      return;
    }
    saving.current = true;
    setBusy(true);
    setError(null);
    let done = 0;
    try {
      for (const identifier of ids) {
        await fleet.mutate({
          action: "create",
          payload: {
            name: `${FLEET_NAMES[project]} ${identifier.slice(0, 6)}…${identifier.slice(-4)}`,
            hardware: "",
            binding: {
              project,
              identifier,
              worker: "",
              ...(isPoolProject(project) ? { pool: poolProvider(project) } : {}),
            },
          },
        });
        done++;
        setRaw(ids.slice(done).join("\n"));
      }
    } catch (e) {
      setError(
        e instanceof Error && e.message === "project_device_limit_reached"
          ? c.limit
          : e instanceof Error && e.message === "duplicate_binding"
            ? c.duplicate
            : c.unavailable,
      );
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="project-address-book" aria-label={copy.title[locale]}>
      <div className="project-section-head">
        <h2>
          {copy.title[locale]} <small>{devices.length}</small>
        </h2>
        <a href={`/${locale}/devices?project=${project}`}>{c.title} →</a>
      </div>
      {isPoolProject(project) && (
        <p className="compute-caption">
          {poolCopy.pool[locale]} · {poolName(project)}
        </p>
      )}
      {!auth.userId ? (
        <button
          type="button"
          className="site-button"
          disabled={!auth.ready || auth.signingIn}
          onClick={() => void auth.signInWithGoogle()}
        >
          {copy.login[locale]}
        </button>
      ) : (
        <>
          <form
            className="project-address-add"
            onSubmit={(e) => {
              e.preventDefault();
              void add();
            }}
          >
            <label>
              {copy.input[locale]}
              <textarea
                maxLength={6000}
                value={raw}
                disabled={busy || !fleet.ready}
                onChange={(e) => setRaw(e.target.value)}
                rows={2}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <button className="site-button" disabled={busy || !fleet.ready || !raw.trim()}>
              {busy ? c.loading : copy.add[locale]}
            </button>
          </form>
          <p className="compute-caption">
            {copy.sync[locale]} · {devices.length} / {fleet.limit}
          </p>
        </>
      )}
      {(error || fleet.error) && <p role="alert">{error ?? c.unavailable}</p>}
      {auth.userId && !fleet.ready && !fleet.error && <p role="status">{c.loading}</p>}
      <div className="project-address-grid">
        {devices.map((d) =>
          d.bindings.map((b) => {
            const r = read(b);
            return (
              <article className="project-address-card" key={b.id}>
                <div className="project-address-heading">
                  <h3>{d.name}</h3>
                  <span>{c[r.status]}</span>
                </div>
                <code className="platform-public-id">{b.identifier}</code>
                <p>{r.activity}</p>
                {r.accountSummary && (
                  <div>
                    <span className="compute-caption">
                      {project === "noid"
                        ? additionalMetricCopy.balance[locale]
                        : r.accountSummary.kind === "month"
                          ? c.monthPoints
                          : c.balance}
                    </span>
                    <strong>
                      {r.accountSummary.amount} {r.accountSummary.unit}
                    </strong>
                  </div>
                )}
                {r.today !== null && (
                  <p>
                    {r.todayLabel ?? c.today} · {r.today} {r.unit}
                  </p>
                )}
                <p className="compute-caption">
                  {r.source} · {r.updated}
                </p>
                {r.note && <p className="compute-caption">{r.note}</p>}
                <div className="pool-card-actions">
                  {onSelect && (
                    <button
                      type="button"
                      className="site-button"
                      aria-pressed={selected === b.identifier}
                      onClick={() => {
                        setSelected(b.identifier);
                        onSelect?.(b.identifier);
                      }}
                    >
                      {copy.detail[locale]}
                    </button>
                  )}
                  {isPoolProject(project) && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        if (!window.confirm(`${poolCopy.remove[locale]} ${d.name}?`)) return;
                        setBusy(true);
                        setError(null);
                        try {
                          await fleet.mutate({
                            action: "unlink",
                            payload: { id: d.id, bindingId: b.id },
                          });
                        } catch {
                          setError(c.unavailable);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      {poolCopy.remove[locale]}
                    </button>
                  )}
                </div>
              </article>
            );
          }),
        )}
      </div>
    </section>
  );
}
