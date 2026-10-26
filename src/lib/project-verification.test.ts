import { describe, expect, it } from "vitest";
import { PROJECT_IDS } from "./projects";
import { LOCALES } from "./site";
import { projectQuestions } from "../components/project-editorial";
import { projectVerification, verificationQuestion } from "../components/project-verification";
import { projectsSeo } from "../components/projects-seo";
import { buildLlmsFullTxt } from "./crawl";
import { loadDepthArticle } from "../components/site/project-depth";

describe("project source verification", () => {
  it("keeps visible answers, FAQ schema and text export consistent in all languages", () => {
    const text = buildLlmsFullTxt();
    expect(Object.keys(projectVerification).sort()).toEqual([...PROJECT_IDS].sort());
    for (const id of PROJECT_IDS)
      for (const locale of LOCALES) {
        const answer = projectVerification[id][locale];
        expect(answer.length).toBeGreaterThan(30);
        expect(projectQuestions(id, locale)).toContainEqual({
          question: verificationQuestion[locale],
          answer,
        });
        const faq = projectsSeo(locale, id)
          .scripts.map((s) => JSON.parse(s.children))
          .find((s) => s["@type"] === "FAQPage");
        expect(faq.mainEntity).toContainEqual({
          "@type": "Question",
          name: verificationQuestion[locale],
          acceptedAnswer: { "@type": "Answer", text: answer },
        });
        expect(text).toContain(answer);
      }
  });
  it("describes current Acurast manager rewards and chain heartbeats rather than registration-only coverage", async () => {
    const rewards = await loadDepthArticle("acurast-rewards-settlement");
    expect(rewards?.body.en.join(" ")).toContain("ManagerMetricRewards");
    expect(rewards?.body.en.join(" ")).toContain("Hong Kong midnight");
    const monitor = await loadDepthArticle("acurast-monitor-guide");
    expect(monitor?.description.en).toContain("manager or processor");
    expect(monitor?.summary?.en).not.toContain("only confirms mainnet registration");
    const heartbeats = await loadDepthArticle("acurast-phone-job-status");
    expect(heartbeats?.body.en.join(" ")).toContain("31-minute");
  });
});
