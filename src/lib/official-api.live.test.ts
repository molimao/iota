import { describe, expect, it } from "vitest";
import { fetchUpstream, TTL } from "./iota-upstream.server";
import { discoverOfficialDevices } from "./iota-discovery.server";
import { buildDeviceEarnings } from "./earnings-data";
import { trainingRows } from "./training";
import type {
  CumulativeTokens,
  EntitlementHistory,
  EntitlementTotals,
  EpochMetrics,
  MinerRecord,
  Occupancy,
  RunInfo,
  RunProgress,
  ThroughputSeries,
} from "./iota-types";

// Opt-in only; never rely on a live service for the normal regression suite.
describe.skipIf(process.env["IOTA_LIVE_CHECK"] !== "1")(
  "official mainnet API through the validated proxy",
  () => {
    it("reads every supported data family without persisting a real Miner ID", async () => {
      const runs = await fetchUpstream<{ runs: RunInfo[] }>("/runs", TTL.runs);
      expect(runs.error, "runs").toBeNull();
      const active = runs.data?.runs.filter((run) => run.state === "active") ?? [];
      expect(active.length, "active runs").toBeGreaterThan(0);
      const occupancy = await fetchUpstream<Occupancy>("/v1/runs_occupancy", TTL.occupancy);
      expect(occupancy.error, "occupancy").toBeNull();
      const runId = active[0]!.run_id;
      const miners = await fetchUpstream<{ miners: MinerRecord[] }>(
        `/miners?run_id=${runId}`,
        TTL.miners,
      );
      expect(miners.error, "miners").toBeNull();
      const miner =
        miners.data?.miners.find((item) => item.throughput > 0) ?? miners.data?.miners[0];
      expect(!!miner, "public miner record").toBe(true);
      const hotkey = miner!.hotkey;
      const prefix = `/v1/epoch_miner_scores/runs/${runId}/hotkeys/${hotkey}`;
      const progress = await fetchUpstream<RunProgress>(`/progress?run_id=${runId}`, TTL.progress);
      expect(progress.error, "progress").toBeNull();
      const totals = await fetchUpstream<EntitlementTotals>(
        `/v1/entitlements/totals/hotkey/${hotkey}`,
        TTL.rewards,
      );
      const history = await fetchUpstream<EntitlementHistory>(
        `/v1/entitlements/history/hotkey/${hotkey}`,
        TTL.rewards,
      );
      expect(totals.error, "reward totals").toBeNull();
      expect(history.error, "reward history").toBeNull();
      expect(
        buildDeviceEarnings(hotkey, totals, history, Date.now()).todayUnits,
        "today accounting",
      ).not.toBeNull();
      const metrics = await fetchUpstream<EpochMetrics>(
        `${prefix}/metrics?period=week`,
        TTL.metrics,
      );
      const throughput = await fetchUpstream<ThroughputSeries>(
        `${prefix}/throughput?period=week`,
        TTL.metrics,
      );
      const cumulative = await fetchUpstream<CumulativeTokens>(
        `${prefix}/cumulative_tokens?period=week`,
        TTL.metrics,
      );
      expect(metrics.error, "epoch metrics").toBeNull();
      expect(throughput.error, "throughput").toBeNull();
      expect(cumulative.error, "cumulative tokens").toBeNull();
      expect(
        trainingRows(metrics.data, throughput.data, cumulative.data).length,
        "joined training rows",
      ).toBeGreaterThan(0);
      const discovered = await discoverOfficialDevices([hotkey], false, [runId]);
      expect(discovered.errors.length, "full roster discovery errors").toBe(0);
      expect(discovered.fullCoverage, "every active run scanned").toBe(true);
      expect(!!discovered.devices[0]?.miner, "exact public Miner ID found").toBe(true);
    }, 60_000);
  },
);
