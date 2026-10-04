import { describe, expect, it } from "vitest";
import { deviceStatusSource, sourceHealth } from "./data-health";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DataHealth } from "../components/data-health";
import { LocaleContext } from "../components/site/locale";

const now = Date.parse("2026-10-04T02:00:00Z");

describe("data freshness labels", () => {
  it("keeps a successful 56-second-old reading ready, including an in-flight poll", () => {
    expect(sourceHealth({ fetchedAt: now - 56_000 }, now)).toBe("ready");
  });

  it("renders the reported personal-device case without the blanket old-data badge", () => {
    const markup = renderToStaticMarkup(
      createElement(DataHealth, {
        now,
        sources: [{ label: "设备状态", fetchedAt: now - 56_000, loading: true }],
      }),
    );
    expect(markup).toContain('data-state="ready"');
    expect(markup).toContain("56 秒前");
    expect(markup).toContain("刷新中");
    expect(markup).not.toContain("旧数据");
  });

  it("renders a failed recent refresh warning in all five languages", () => {
    for (const [locale, label] of [
      ["zh", "刷新失败"],
      ["en", "Refresh failed"],
      ["zh-TW", "刷新失敗"],
      ["ko", "새로고침 실패"],
      ["ja", "更新に失敗しました"],
    ] as const) {
      const markup = renderToStaticMarkup(
        createElement(
          LocaleContext.Provider,
          {
            value: locale,
          },
          createElement(DataHealth, {
            now,
            sources: [
              { label: "设备状态", fetchedAt: now - 56_000, error: "请求超时", loading: false },
            ],
          }),
        ),
      );
      expect(markup).toContain('data-state="failed"');
      expect(markup).toContain(label);
    }
  });

  it("distinguishes a failed latest poll from expired readings without renewing their clock", () => {
    const source = { fetchedAt: now - 56_000, error: "timeout" };
    expect(sourceHealth(source, now)).toBe("failed");
    expect(sourceHealth(source, now + 300_000)).toBe("old");
    expect(source.fetchedAt).toBe(now - 56_000);
    expect(sourceHealth({ ...source, error: null }, now)).toBe("ready");
  });

  it("shows incomplete coverage separately from all readings being old", () => {
    expect(
      sourceHealth({ fetchedAt: now - 56_000, error: "one run failed", partial: true }, now),
    ).toBe("partial");
  });

  it("preserves independent source limits and never claims an unfetched source is ready", () => {
    expect(sourceHealth({ fetchedAt: now - 360_000 }, now)).toBe("old");
    expect(sourceHealth({ fetchedAt: now - 360_000, maxAgeMs: 900_000 }, now)).toBe("ready");
    expect(sourceHealth({ fetchedAt: null }, now)).toBe("pending");
    expect(sourceHealth({ fetchedAt: null, error: "timeout" }, now)).toBe("failed");
    expect(sourceHealth({ fetchedAt: 0 }, now)).toBe("pending");
  });
});

describe("watched-device source", () => {
  const current = { statusFetchedAt: now - 56_000, statusStale: false, status: "contributing" };
  const retained = {
    statusFetchedAt: now - 600_000,
    statusStale: true,
    status: "refresh_interrupted",
  };

  it("does not age every watched device because an unrelated run failed", () => {
    const source = deviceStatusSource([current], "unrelated run timed out");
    expect(source.fetchedAt).toBe(current.statusFetchedAt);
    expect(sourceHealth(source, now)).toBe("ready");
    expect(source.error).toBeNull();
  });

  it("uses the oldest watched clock and marks mixed successful and retained devices partial", () => {
    const source = deviceStatusSource([current, retained], "timeout");
    expect(source.fetchedAt).toBe(retained.statusFetchedAt);
    expect(sourceHealth(source, now)).toBe("partial");
  });

  it("keeps every genuinely expired device old and returns to ready after recovery", () => {
    expect(sourceHealth(deviceStatusSource([retained], "timeout"), now)).toBe("old");
    expect(sourceHealth(deviceStatusSource([current], null), now)).toBe("ready");
    expect(sourceHealth(deviceStatusSource([current], null, "connection lost"), now)).toBe(
      "failed",
    );
  });

  it("does not count an unresolved device as successful coverage", () => {
    const unknown = { statusFetchedAt: now - 56_000, statusStale: false, status: "unknown" };
    expect(deviceStatusSource([current, unknown], "timeout").partial).toBe(true);
    expect(
      deviceStatusSource([{ ...unknown, statusFetchedAt: null }], "timeout").fetchedAt,
    ).toBeNull();
  });
});
