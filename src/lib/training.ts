import type { CumulativeTokens, EpochMetrics, ThroughputSeries } from "./iota-types";

export type TrainingRow = {
  epoch: number;
  timestamp: number | null;
  tokens: number | null;
  contribution: number | null;
  rank: number | null;
  participants: number | null;
  throughput: number | null;
  cumulative: number | null;
};

/** Official series have different lengths. Join by epoch, never by array index. */
export function trainingRows(
  metrics: EpochMetrics | null,
  throughput: ThroughputSeries | null,
  cumulative: CumulativeTokens | null,
): TrainingRow[] {
  const rows = new Map<number, TrainingRow>();
  const rowFor = (epoch: number) => {
    let row = rows.get(epoch);
    if (!row) {
      row = {
        epoch,
        timestamp: null,
        tokens: null,
        contribution: null,
        rank: null,
        participants: null,
        throughput: null,
        cumulative: null,
      };
      rows.set(epoch, row);
    }
    return row;
  };
  const time = (row: TrainingRow, value: number | undefined) => {
    if (value !== undefined) row.timestamp = Math.max(row.timestamp ?? 0, value);
  };
  for (const [i, epoch] of metrics?.epochs.entries() ?? []) {
    const row = rowFor(epoch);
    row.tokens = metrics!.token_counts[i] ?? null;
    row.contribution = metrics!.act_contribution_percs[i] ?? null;
    row.rank = metrics!.activation_ranks[i] || null;
    row.participants = metrics!.num_hotkeys_in_epochs[i] || null;
    time(row, metrics!.timestamps[i]);
  }
  for (const [i, epoch] of throughput?.epochs.entries() ?? []) {
    const row = rowFor(epoch);
    row.throughput = throughput!.throughputs[i] ?? null;
    time(row, throughput!.timestamps[i]);
  }
  for (const [i, epoch] of cumulative?.epochs.entries() ?? []) {
    const row = rowFor(epoch);
    row.cumulative = cumulative!.token_counts_cumulative[i] ?? null;
    time(row, cumulative!.timestamps[i]);
  }
  return [...rows.values()].sort((a, b) => b.epoch - a.epoch);
}
