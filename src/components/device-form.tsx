import { localizeValue } from "@/components/site/localization";
import { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useLocale } from "@/components/site/locale";
import type { WatchlistResult } from "@/hooks/use-watchlist";
import { minerIdError } from "@/lib/ss58";

export function DeviceForm({
  initialLabel = "",
  initialHotkey = "",
  rename = false,
  duplicateIds = [],
  onSave,
  onCancel,
}: {
  initialLabel?: string;
  initialHotkey?: string;
  rename?: boolean;
  duplicateIds?: string[];
  onSave: (input: { label: string; hotkey: string }) => Promise<WatchlistResult>;
  onCancel: () => void;
}) {
  const { t, en, locale } = useLocale();
  const [label, setLabel] = useState(initialLabel);
  const [hotkey, setHotkey] = useState(initialHotkey);
  const [errors, setErrors] = useState<{
    label?: string | undefined;
    hotkey?: string | undefined;
    save?: string | undefined;
  }>({});
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const idInput = useRef<HTMLInputElement>(null);

  return (
    <form
      className="device-form"
      noValidate
      aria-busy={saving}
      onSubmit={async (event) => {
        event.preventDefault();
        if (submitting.current) return;
        const next = { label: label.trim(), hotkey: hotkey.trim() };
        const labelError = !next.label ? "请填写设备名称" : undefined;
        const idError = rename
          ? undefined
          : minerIdError(next.hotkey) ||
            (duplicateIds.includes(next.hotkey) ? "这个 Miner ID 已经添加过了" : undefined);
        if (labelError || idError) {
          setErrors({
            ...(labelError ? { label: labelError } : {}),
            ...(idError ? { hotkey: idError } : {}),
          });
          (labelError ? nameInput : idInput).current?.focus();
          return;
        }
        submitting.current = true;
        setSaving(true);
        setErrors({});
        try {
          const result = await onSave(next);
          if (!result.ok) setErrors({ save: result.error || "保存失败" });
        } catch {
          setErrors({ save: "保存失败" });
        } finally {
          submitting.current = false;
          setSaving(false);
        }
      }}
    >
      <label>
        {t("设备名称")}
        <input
          ref={nameInput}
          autoFocus
          required
          maxLength={40}
          value={label}
          disabled={saving}
          aria-invalid={!!errors.label}
          aria-describedby={errors.label ? "device-name-error" : undefined}
          onChange={(event) => {
            setLabel(event.target.value);
            setErrors((current) => ({ ...current, label: undefined, save: undefined }));
          }}
          placeholder={t("例如：书房电脑")}
        />
      </label>
      {errors.label && (
        <p id="device-name-error" role="alert">
          {t(errors.label)}
        </p>
      )}
      {!rename && (
        <>
          <label>
            Miner ID
            <input
              ref={idInput}
              required
              maxLength={64}
              value={hotkey}
              disabled={saving}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={!!errors.hotkey}
              aria-describedby={errors.hotkey ? "device-id-error" : "device-id-help"}
              onChange={(event) => {
                setHotkey(event.target.value);
                setErrors((current) => ({ ...current, hotkey: undefined, save: undefined }));
              }}
              placeholder={t("从 IOTA 应用复制完整 ID")}
            />
          </label>
          {errors.hotkey && (
            <p id="device-id-error" role="alert">
              {t(errors.hotkey)}
            </p>
          )}
          <p id="device-id-help" className="form-help">
            {t("填写公开的 Miner ID，不需要私钥或助记词。")}
          </p>
        </>
      )}
      {errors.save && <p role="alert">{t(errors.save)}</p>}
      <div className="actions form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          {t("取消")}
        </button>
        <button className="solid" type="submit" disabled={saving}>
          {saving && <LoaderCircle size={16} className="spin" />}
          {saving
            ? t("保存中…")
            : rename
              ? localizeValue(en ? "Save name" : "保存名称", locale)
              : t("保存设备")}
        </button>
      </div>
    </form>
  );
}
