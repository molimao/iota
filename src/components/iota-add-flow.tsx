import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LoaderCircle } from "lucide-react";
import { useLocale } from "./site/locale";
import { DeviceForm } from "./device-form";
import { iotaAddCopy as copy } from "./iota-add-copy";
import { parseIotaAddresses, type AdditionRow } from "@/lib/iota-addition";
import { discoverWallet } from "@/lib/iota.functions";
import { isValidMinerId, shortId } from "@/lib/ss58";
import type { WatchlistResult } from "@/hooks/use-watchlist";

export function IotaAddFlow({
  initialHotkey = "",
  duplicateIds,
  limit,
  remaining,
  onSave,
  onCancel,
  onComplete,
  onBusy,
  initialMode = "single",
}: {
  initialHotkey?: string;
  duplicateIds: string[];
  limit: number;
  remaining: number;
  onSave: (input: { label: string; hotkey: string }) => Promise<WatchlistResult>;
  onCancel: () => void;
  onComplete: () => void;
  onBusy?: (busy: boolean) => void;
  initialMode?: "single" | "multiple" | "wallet";
}) {
  const { locale, t } = useLocale();
  const findWallet = useServerFn(discoverWallet);
  const [mode, setMode] = useState(initialMode);
  const [raw, setRaw] = useState("");
  const [rows, setRows] = useState<AdditionRow[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [partial, setPartial] = useState(false);
  const locked = useRef(false);
  const slots = Math.max(0, remaining);
  const c = Object.fromEntries(Object.entries(copy).map(([k, v]) => [k, v[locale]])) as {
    [K in keyof typeof copy]: string;
  };
  function loadRows(next: AdditionRow[]) {
    setRows(next);
    setSaved([]);
    setChosen(
      next
        .filter((r) => !r.issue)
        .slice(0, slots)
        .map((r) => r.hotkey),
    );
  }
  async function check() {
    if (locked.current) return;
    setError("");
    setPartial(false);
    if (!raw.trim()) {
      setError(c.invalid!);
      return;
    }
    if (mode === "wallet" && !isValidMinerId(raw)) {
      setError(c.invalid!);
      return;
    }
    locked.current = true;
    setBusy(true);
    onBusy?.(true);
    try {
      if (mode === "multiple") loadRows(parseIotaAddresses(raw, duplicateIds));
      else {
        const result = await findWallet({ data: { coldkey: raw.trim() } });
        setPartial(!result.fullCoverage || result.truncated);
        loadRows(parseIotaAddresses(result.hotkeys.join("\n"), duplicateIds));
        if (!result.hotkeys.length) setError(result.fullCoverage ? c.empty! : c.queryFailed!);
      }
    } catch (e) {
      setError(e instanceof Error && e.message === "too_many_addresses" ? c.cap! : c.queryFailed!);
    } finally {
      locked.current = false;
      setBusy(false);
      onBusy?.(false);
    }
  }
  async function saveSelected() {
    if (locked.current || !chosen.length || chosen.length > slots) return;
    locked.current = true;
    setBusy(true);
    onBusy?.(true);
    setError("");
    const completed: string[] = [];
    try {
      for (const hotkey of chosen) {
        const row = rows.find((r) => r.hotkey === hotkey)!;
        if (!row.label.trim()) {
          setError(c.failed!);
          break;
        }
        const outcome = await onSave({ hotkey, label: row.label.trim() });
        if (!outcome.ok) {
          setError(outcome.error || c.failed!);
          break;
        }
        completed.push(hotkey);
        setSaved((previous) => [...previous, hotkey]);
      }
      setChosen((previous) => previous.filter((id) => !completed.includes(id)));
      if (completed.length === chosen.length) onComplete();
    } catch {
      setError(c.failed!);
      setChosen((previous) => previous.filter((id) => !completed.includes(id)));
    } finally {
      locked.current = false;
      setBusy(false);
      onBusy?.(false);
    }
  }
  return (
    <div className="iota-add-flow">
      <div className="iota-add-modes" role="group" aria-label={t("添加设备")}>
        {(["single", "multiple", "wallet"] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={mode === key}
            disabled={busy}
            onClick={() => {
              setMode(key);
              setRows([]);
              setChosen([]);
              setRaw("");
              setError("");
              setPartial(false);
            }}
          >
            {c[key]}
          </button>
        ))}
      </div>
      {mode === "single" ? (
        <DeviceForm
          initialHotkey={initialHotkey}
          duplicateIds={duplicateIds}
          limit={limit}
          onCancel={onCancel}
          onSave={async (input) => {
            setBusy(true);
            onBusy?.(true);
            try {
              const result = await onSave(input);
              if (result.ok) onComplete();
              return result;
            } finally {
              setBusy(false);
              onBusy?.(false);
            }
          }}
        />
      ) : (
        <>
          <label className="iota-address-input">
            {mode === "wallet" ? c.coldkey : c.input}
            <textarea
              autoFocus
              rows={mode === "wallet" ? 2 : 4}
              value={raw}
              maxLength={mode === "wallet" ? 64 : 14000}
              wrap="off"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="none"
              disabled={busy}
              onChange={(e) => {
                setRaw(e.target.value);
                setRows([]);
                setChosen([]);
                setError("");
                setPartial(false);
              }}
            />
          </label>
          {mode === "wallet" && <p className="form-help">{c.scope}</p>}
          <button
            type="button"
            className="iota-check-button"
            disabled={busy || !raw.trim()}
            onClick={() => void check()}
          >
            {busy && <LoaderCircle size={15} className="spin" />}
            {mode === "wallet" ? c.scan : c.check}
          </button>
          {partial && (
            <p role="status" className="form-help">
              {c.partial}
            </p>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {!!rows.length && (
            <>
              <div className="iota-selection-heading">
                <b>
                  {c.select} · {chosen.length}
                </b>
                <span>
                  {c.remaining} {slots}
                </span>
              </div>
              {rows.filter((row) => !row.issue && !saved.includes(row.hotkey)).length > slots && (
                <a className="iota-quota-link" href={`/${locale}/devices?view=membership#pro-plan`}>
                  {c.plans}
                </a>
              )}
              <div className="iota-add-results">
                {rows.map((row, index) => {
                  const done = !row.issue && saved.includes(row.hotkey),
                    disabled = busy || !!row.issue || done;
                  return (
                    <div className="iota-add-result" key={`${row.hotkey}-${index}`}>
                      <input
                        type="checkbox"
                        aria-label={`${c.select} ${shortId(row.hotkey)}`}
                        checked={!row.issue && (done || chosen.includes(row.hotkey))}
                        disabled={
                          disabled || (!chosen.includes(row.hotkey) && chosen.length >= slots)
                        }
                        onChange={(e) =>
                          setChosen((previous) =>
                            e.target.checked
                              ? [...previous, row.hotkey]
                              : previous.filter((id) => id !== row.hotkey),
                          )
                        }
                      />
                      <div>
                        <code title={row.hotkey}>{shortId(row.hotkey)}</code>
                        {row.issue ? (
                          <span>{c[row.issue]}</span>
                        ) : (
                          <input
                            aria-label={`${c.name} ${index + 1}`}
                            value={row.label}
                            maxLength={40}
                            disabled={disabled}
                            onChange={(e) =>
                              setRows((previous) =>
                                previous.map((r, i) =>
                                  i === index ? { ...r, label: e.target.value } : r,
                                ),
                              )
                            }
                          />
                        )}
                      </div>
                      {done && <span>{c.saved}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="actions form-actions">
                <button type="button" disabled={busy} onClick={onCancel}>
                  {t("取消")}
                </button>
                <button
                  type="button"
                  className="solid"
                  disabled={
                    busy ||
                    !chosen.length ||
                    chosen.length > slots ||
                    rows.some((r) => chosen.includes(r.hotkey) && !r.label.trim())
                  }
                  onClick={() => void saveSelected()}
                >
                  {busy && <LoaderCircle size={15} className="spin" />}
                  {c.add} · {chosen.length}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
