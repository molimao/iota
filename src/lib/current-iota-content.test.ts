import { describe, expect, it } from "vitest";
import type { Article } from "@/components/site/articles";
import { currentIotaContent } from "@/components/site/current-iota-content";
import { iotaPublicFacts as facts } from "@/lib/iota-public-facts";
import { LOCALES, type SiteLocale } from "@/lib/site";

function five<T>(fill: (locale: SiteLocale) => T) {
  return Object.fromEntries(LOCALES.map((locale) => [locale, fill(locale)])) as Record<
    SiteLocale,
    T
  >;
}

function article(partial: Partial<Article> & Pick<Article, "slug" | "body">): Article {
  return {
    topic: five(() => "topic"),
    title: five(() => "title"),
    description: five(() => "Plain description without a fact trigger."),
    published: "2026-10-01",
    modified: "2026-10-01",
    ...partial,
  };
}

const dayEn =
  "Today’s rewards follow [reward rules](/learn/how-rewards-work): Hong Kong midnight, pending and settled only.";
const dayKo =
  "어제 보상은 [보상 규칙](/learn/how-rewards-work)을 따르며 보류·정산만 자정에 합산합니다.";
const agentEn =
  "The API base is [iota-web](https://iota-web.api.macrocosmos.ai/mainnet/runs). IOTA Watch cannot read local logs or control the app.";
const agentKo =
  "API는 [iota-web](https://iota-web.api.macrocosmos.ai/mainnet/runs)입니다. 로컬 로그를 읽거나 공식 앱을 제어할 수 없습니다.";

describe("English-first IOTA fact alignment", () => {
  it("applies the day fact to every locale when only English matches pending/settled", () => {
    const source = article({
      slug: "fixture-day",
      body: five((locale) => [locale === "ko" ? dayKo : dayEn]),
    });
    const next = currentIotaContent(source);
    for (const locale of LOCALES) {
      expect(next.body[locale][0]).toBe(facts.day[locale]);
      expect(next.body[locale][0]).not.toContain("/learn/how-rewards-work");
    }
    expect(next.modified).toBe("2026-10-24");
    expect(next.published).toBe("2026-10-01");
  });

  it("applies the agent fact when Korean misses the cannot-read-logs pattern", () => {
    const source = article({
      slug: "fixture-agent",
      body: five((locale) => [locale === "ko" ? agentKo : agentEn]),
    });
    const next = currentIotaContent(source);
    for (const locale of LOCALES) {
      expect(next.body[locale][0]).toBe(facts.agent[locale]);
      expect(next.body[locale][0]).not.toContain("iota-web.api.macrocosmos.ai");
      expect(next.body[locale][0]).not.toMatch(/cannot control|제어할 수 없/);
    }
    expect(next.modified).toBe("2026-10-24");
    expect(next.published).toBe(source.published);
  });

  it("leaves an unrelated block and an already-canonical article on their old dates", () => {
    const unrelated = article({
      slug: "fixture-plain",
      modified: "2026-09-01",
      body: five(() => ["Dictionary link stays [here](/learn/find-miner-id)."]),
    });
    const plain = currentIotaContent(unrelated);
    expect(plain).toBe(unrelated);
    expect(plain.body.ko[0]).toBe(unrelated.body.ko[0]);
    expect(plain.modified).toBe("2026-09-01");

    const canonical = article({
      slug: "fixture-canonical",
      modified: "2026-10-17",
      body: five((locale) => [facts.day[locale], "Still a [guide](/learn/find-miner-id)."]),
    });
    const kept = currentIotaContent(canonical);
    expect(kept).toBe(canonical);
    expect(kept.modified).toBe("2026-10-17");
    expect(kept.body.ja[1]).toBe("Still a [guide](/learn/find-miner-id).");
  });
});
