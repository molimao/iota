import { describe, it, expect } from "vitest";
import { base58, bech32 } from "@scure/base";
import { validComputeId, parseNosanaNode, parseGonkaNetwork } from "./compute";
import { projectsSeo } from "../components/projects-seo";
import { PROJECT_IDS } from "./projects";
import { LOCALES } from "./site";
import { buildSitemapXml, buildLlmsFullTxt } from "./crawl";
const host = bech32.encode("gonka", bech32.toWords(new Uint8Array(20).fill(3)));
describe("compute coverage and public identifiers", () => {
  it("validates the chain encoding and checksum", () => {
    expect(validComputeId("nosana", base58.encode(new Uint8Array(32).fill(4)))).toBe(true);
    expect(validComputeId("nosana", "0".repeat(44))).toBe(false);
    expect(validComputeId("gonka", host)).toBe(true);
    expect(validComputeId("gonka", host.slice(0, -1) + "q")).toBe(false);
  });
  it("does not turn malformed or missing task counts into zero", () => {
    expect(parseNosanaNode({ completed: 0 }, { jobs: [], totalJobs: 0 })).toMatchObject({
      running: 0,
      completed: 0,
    });
    expect(() => parseNosanaNode({}, { jobs: [], totalJobs: 0 })).toThrow();
    expect(() => parseNosanaNode({ completed: -1 }, { jobs: [], totalJobs: 0 })).toThrow();
  });
  it("keeps epoch weight and ML node count distinct from rewards", () => {
    const snapshot = parseGonkaNetwork({
      active_participants: {
        epoch_id: 416,
        participants: [
          {
            index: host,
            models: ["model"],
            weight: "1619",
            ml_nodes: [{ ml_nodes: [{ node_id: "a" }, { node_id: "a" }, { node_id: "b" }] }],
          },
        ],
      },
    });
    expect(snapshot.participants[0]).toMatchObject({ nodes: 2, weight: "1619" });
    expect(snapshot.completed).toBe(null);
    expect(() => parseGonkaNetwork({})).toThrow();
  });
  it("publishes localized canonical, FAQ and sitemap entries for every project", () => {
    const sitemap = buildSitemapXml();
    for (const id of PROJECT_IDS)
      for (const locale of LOCALES) {
        const seo = projectsSeo(locale, id);
        expect(seo.links).toContainEqual({
          rel: "canonical",
          href: `https://iotahome.site/${locale}/projects/${id}`,
        });
        expect(seo.links.filter((l) => l.rel === "alternate")).toHaveLength(6);
        expect(seo.scripts.some((s) => JSON.parse(s.children)["@type"] === "FAQPage")).toBe(true);
        expect(sitemap).toContain(`/${locale}/projects/${id}`);
      }
    expect(buildLlmsFullTxt()).toContain("Epoch membership is not live uptime");
  });
});
