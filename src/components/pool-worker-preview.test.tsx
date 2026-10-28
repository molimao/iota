import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PoolWorkerPreview } from "./pool-worker-preview";
it("keeps three wallet workers visible and preserves unknown state", () => {
  const data = {
    count: 4,
    workers: [true, false, null, true].map((online, i) => ({
      name: `rig-${i}`,
      online,
      hashrate: i ? 0 : 1000000,
      lastSeen: null,
    })),
  };
  const html = renderToStaticMarkup(<PoolWorkerPreview project="prl" data={data} locale="zh" />);
  expect(html).toContain("rig-0");
  expect(html).toContain("rig-2");
  expect(html).not.toContain("rig-3");
  expect(html).toContain('data-state="online"');
  expect(html).toContain('data-state="offline"');
  expect(html).toContain('data-state="unknown"');
});
it("explains a pool-reported count without inventing worker records", () => {
  const html = renderToStaticMarkup(
    <PoolWorkerPreview project="btc" data={{ count: 8, workers: [] }} locale="en" />,
  );
  expect(html).not.toContain("<li");
  expect(html).toContain("8");
});

it("renders each Worker association in its own row", () => {
  const html = renderToStaticMarkup(
    <PoolWorkerPreview
      project="prl"
      locale="zh"
      data={{
        count: 2,
        workers: ["gpu1", "gpu2"].map((name) => ({
          name,
          hashrate: 1,
          online: true,
          lastSeen: null,
        })),
      }}
      workerAgent={(worker) => <button>{`Link ${worker}`}</button>}
    />,
  );
  expect(html).toContain("Link gpu1");
  expect(html).toContain("Link gpu2");
  expect(html.match(/pool-worker-agent-slot/g) ?? []).toHaveLength(2);
});
