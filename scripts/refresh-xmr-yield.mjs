// Public XMRig results only. This script never reads device credentials or logs.
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer } from "vite";
import {
  XMR_MAC_PROFILES,
  xmrigStoredBenchmarkSchema,
  xmrHardwareRows,
} from "../src/lib/xmr-hardware.ts";
const profilesByChip = Map.groupBy(XMR_MAC_PROFILES, (p) => p.chip);
async function json(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw Error("Upstream HTTP " + r.status);
  return r.json();
}
let records = [];
if (process.argv[2]) {
  const researched = JSON.parse(await readFile(process.argv[2], "utf8"));
  records = researched.records;
} else {
  const { selectXmrigCandidate, parseXmrigBenchmark } =
    await import("../src/lib/xmr-benchmark-data.ts");
  for (const [chip, profiles] of profilesByChip) {
    const list = await json(
      "https://api.xmrig.com/1/benchmarks?cpu=" + encodeURIComponent(chip) + "&algo=rx%2F0",
    );
    for (const profile of profiles) {
      const selected = selectXmrigCandidate(list, chip, profile.cores);
      const parsed = parseXmrigBenchmark(
        await json("https://api.xmrig.com/1/benchmark/" + selected.id),
        { chip, cores: profile.cores },
      );
      records.push({
        ...parsed,
        model: profile.model,
        recordId: parsed.id,
        submissionCount: selected.submissionCount,
      });
    }
  }
}
const benchmarks = xmrigStoredBenchmarkSchema.array().parse(records);
for (const profile of XMR_MAC_PROFILES) {
  const record = benchmarks.find((b) => b.model === profile.model);
  if (!record || record.chip !== profile.chip || record.cores !== profile.cores)
    throw Error("Missing or mismatched profile " + profile.model);
}
const cacheDir = await mkdtemp(join(tmpdir(), "iota-xmr-calc-"));
const server = await createServer({
  configFile: false,
  cacheDir,
  server: { middlewareMode: true, ws: false, hmr: false },
  resolve: { alias: { "@": resolve("src") } },
});
try {
  const { readXmrHardwareMarket } = await server.ssrLoadModule("/src/lib/xmr-hardware.server.ts");
  const market = await readXmrHardwareMarket();
  const snapshots = xmrHardwareRows(benchmarks, market.network, market.usd, market.fetchedAt);
  await writeFile(
    new URL("../src/lib/xmr-benchmarks.json", import.meta.url),
    JSON.stringify(benchmarks, null, 2) + "\n",
  );
  await writeFile(
    new URL("../src/lib/xmr-yield-snapshot.json", import.meta.url),
    JSON.stringify(snapshots, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      models: benchmarks.length,
      networkHeight: market.network.height,
      xmrUsd: market.usd,
      examples: snapshots
        .filter((s) => ["m2-8c", "m3-8c", "m3-ultra-32c"].includes(s.model))
        .map((s) => ({ model: s.model, coins: s.rows[0].coinsPerDay, usd: s.rows[0].usdPerDay })),
    }),
  );
} finally {
  await server.close();
  await rm(cacheDir, { recursive: true, force: true });
}
