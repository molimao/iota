import { localized } from "@/lib/product-discovery";
import { localizeValue } from "@/components/site/localization";
import { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { DeviceForm } from "@/components/device-form";
import { useLocale } from "@/components/site/locale";
import type { WatchlistResult } from "@/hooks/use-watchlist";
import type { WatchEntry } from "@/lib/watchlist";

export function DeviceActions({
  onCancel,
  initialMode = "actions",
  entry,
  cloud,
  onRename,
  onRemove,
  onRemoved,
}: {
  onCancel?: () => void;
  initialMode?: "actions" | "remove";
  entry: WatchEntry;
  cloud: boolean;
  onRename: (hotkey: string, label: string) => Promise<WatchlistResult>;
  onRemove: (hotkey: string) => Promise<WatchlistResult>;
  onRemoved: () => void;
}) {
  const { t, en, locale } = useLocale();
  const [mode, setMode] = useState<"actions" | "rename" | "remove">(initialMode);
  const [feedback, setFeedback] = useState("");
  const [failed, setFailed] = useState(false);
  const [removing, setRemoving] = useState(false);
  const busy = useRef(false);

  return (
    <section
      className="device-management"
      aria-label={localizeValue(en ? "Manage device" : "管理设备", locale)}
    >
      {feedback && (
        <p className="management-feedback" role={failed ? "alert" : "status"}>
          {t(feedback)}
        </p>
      )}
      {mode === "rename" ? (
        <DeviceForm
          rename
          initialLabel={entry.label}
          initialHotkey={entry.hotkey}
          onCancel={() => setMode("actions")}
          onSave={async ({ label }) => {
            const result = await onRename(entry.hotkey, label);
            if (result.ok) {
              setMode("actions");
              setFeedback("名称已保存");
              setFailed(false);
            }
            return result;
          }}
        />
      ) : mode === "remove" ? (
        <div className="remove-confirmation" aria-busy={removing}>
          <h3>
            {localizeValue(en ? `Remove ${entry.label}?` : `移除「${entry.label}」？`, locale)}
          </h3>
          <p>
            {localized([
              "移除这条 IOTA 监控记录，保留其他项目关联，不会停止训练。",
              "移除此 IOTA 監控記錄，保留其他專案關聯，不會停止訓練。",
              "Remove this IOTA monitoring entry. Other project links are kept and training continues.",
              "IOTA 모니터링 기록을 제거합니다. 다른 프로젝트 연결은 유지되며 학습은 계속됩니다.",
              "このIOTA監視記録を削除します。他のプロジェクトの関連付けと学習は維持されます。",
            ])[locale]}
          </p>
          <div className="actions form-actions">
            <button
              autoFocus
              disabled={removing}
              onClick={() => {
                if (onCancel) onCancel();
                else setMode("actions");
                setFeedback("");
              }}
            >
              {t("取消")}
            </button>
            <button
              className="danger"
              disabled={removing}
              onClick={async () => {
                if (busy.current) return;
                busy.current = true;
                setRemoving(true);
                setFeedback("");
                try {
                  const result = await onRemove(entry.hotkey);
                  if (result.ok) onRemoved();
                  else {
                    setFeedback(result.error || "移除失败，请稍后重试。");
                    setFailed(true);
                  }
                } catch {
                  setFeedback("移除失败，请稍后重试。");
                  setFailed(true);
                } finally {
                  busy.current = false;
                  setRemoving(false);
                }
              }}
            >
              {removing && <LoaderCircle size={16} className="spin" />}
              {removing ? t("移除中…") : t("确认移除")}
            </button>
          </div>
        </div>
      ) : (
        <div className="actions detail-actions">
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(entry.hotkey);
                setFeedback("Miner ID 已复制");
                setFailed(false);
              } catch {
                setFeedback("复制失败，请展开技术信息手动复制。");
                setFailed(true);
              }
            }}
          >
            {t("复制 ID")}
          </button>
          <button
            onClick={() => {
              setMode("rename");
              setFeedback("");
            }}
          >
            {t("改名")}
          </button>
          <button
            className="danger"
            onClick={() => {
              setMode("remove");
              setFeedback("");
            }}
          >
            {t("移除设备")}
          </button>
        </div>
      )}
    </section>
  );
}
