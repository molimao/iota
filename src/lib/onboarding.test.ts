import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
const state = vi.hoisted(() => ({ lookup: "bad-id", query: vi.fn() }));
vi.mock("@tanstack/react-router", async (original) => ({
  ...(await original<typeof import("@tanstack/react-router")>()),
  useRouterState: () => state.lookup,
}));
vi.mock("@/hooks/use-iota-dashboard", () => ({ useIotaDashboard: state.query }));
import { Dashboard } from "../components/dashboard";
import { LocaleContext } from "../components/site/locale";
import { MonitoringExample, AdditionHelp, ProjectAccessLabel } from "../components/onboarding";
import { onboardingCopy, projectHelpPath, projectAccess } from "./onboarding";
import { LOCALES } from "./site";
import { PROJECT_IDS } from "./projects";
import { base58 } from "@scure/base";
import { blake2b } from "@noble/hashes/blake2.js";
import { getArticle } from "../components/site/articles";
function html(locale: (typeof LOCALES)[number], child: ReturnType<typeof createElement>) {
  return renderToStaticMarkup(createElement(LocaleContext.Provider, { value: locale }, child));
}
describe("public lookup and onboarding", () => {
  it("rejects a malformed or script-like lookup before querying device data", () => {
    for (const input of ["bad-id", "<script>alert(1)</script>", "", "x".repeat(500)]) {
      state.lookup = input;
      state.query.mockClear();
      const result = html("en", createElement(Dashboard));
      expect(result).toContain(onboardingCopy.invalid.en);
      expect(result).not.toContain("<script>");
      expect(state.query).not.toHaveBeenCalled();
    }
  });
  it("queries a valid identifier without fleet persistence and keeps unavailable earnings unknown", () => {
    const body = new Uint8Array(33);
    body[0] = 42;
    body.fill(4, 1);
    const checksum = blake2b(new Uint8Array([...new TextEncoder().encode("SS58PRE"), ...body]), {
      dkLen: 64,
    });
    const id = base58.encode(new Uint8Array([...body, ...checksum.slice(0, 2)]));
    state.lookup = id;
    state.query.mockClear();
    state.query.mockReturnValue({
      views: [
        {
          entry: { hotkey: id },
          status: "unknown",
          miner: null,
          earnings: null,
          todayUsable: false,
          earningsUsable: false,
          statusStale: false,
          statusFetchedAt: null,
        },
      ],
      loading: false,
      usdPerIota: null,
      now: Date.now(),
      manual: { running: false, cooldownRemaining: 0 },
      fetching: false,
      statusError: null,
    });
    const result = html("en", createElement(Dashboard));
    expect(state.query).toHaveBeenCalledWith(
      [{ hotkey: id, label: expect.any(String), addedAt: 0 }],
      true,
      { persistTelemetry: false },
    );
    expect(result).toContain(onboardingCopy.lookupNote.en);
    expect(result).toContain(`/en/app?add=${id}`);
    expect(result).not.toContain("$0.00");
    expect(result).not.toContain("0.00000000");
    expect(result).not.toContain('role="dialog"');
  });
  it("keeps sample data clearly labelled and routes project-specific help to real articles", () => {
    for (const locale of LOCALES) {
      const result = html(locale, createElement(MonitoringExample));
      expect(result).toContain(onboardingCopy.sampleNote[locale]);
      for (const project of PROJECT_IDS) {
        const path = projectHelpPath(locale, project);
        expect(getArticle(path.split("/").at(-1)!)).toBeDefined();
        const free = html(locale, createElement(AdditionHelp, { project, plan: "free" }));
        expect(free).toContain(path);
        expect(free).toContain(onboardingCopy.quota[locale]);
        expect(free).toContain(`/${locale}/devices?view=membership`);
        const access = html(locale, createElement(ProjectAccessLabel, { project }));
        expect(access).toContain(
          projectAccess(project) === "private"
            ? onboardingCopy.private[locale]
            : onboardingCopy.public[locale],
        );
      }
    }
    expect(PROJECT_IDS.filter((p) => projectAccess(p) === "private")).toEqual(["ionet", "vast"]);
  });
});
