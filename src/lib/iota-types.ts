export type RunInfo = {
  run_id: string;
  name: string;
  state: string;
  metadata?: {
    description?: string;
    n_splits?: number;
    model_name?: string;
    model_size?: string;
  } | null;
};

export type MinerRecord = {
  timestamp: number;
  layer: number;
  hotkey: string;
  coldkey: string;
  activation_count: number;
  throughput: number;
  is_active: boolean;
  registration_time: number;
  run_id: string;
  location_name?: string | null;
  location_country?: string | null;
};

export type Occupancy = {
  run_ids: string[];
  max_miners: number[];
  active_miners: number[];
  slots_remaining: number[];
};

export type RunProgress = {
  activation_count: number;
  total_activations: number;
  token_count: number;
  total_tokens: number;
  loss: number | null;
};

export type EpochMetrics = {
  epochs: number[];
  token_counts: number[];
  act_contribution_percs: number[];
  activation_ranks: number[];
  num_hotkeys_in_epochs: number[];
  timestamps: number[];
};

export type ThroughputSeries = {
  epochs: number[];
  throughputs: number[];
  timestamps: number[];
};

export type CumulativeTokens = {
  epochs: number[];
  token_counts_cumulative: number[];
  timestamps: number[];
};

export type EntitlementTotals = {
  total_amount_earned: number;
  total_amount_paid: number;
  total_amount_pending: number;
  total_amount_frozen: number;
  minimum_payout_amount: number;
};

export type EntitlementHistory = {
  alpha_amounts: number[];
  timestamps: number[];
  statuses: string[];
};

/** Per-hotkey earnings computed server-side from the official endpoints. */
export type DeviceEarnings = {
  hotkey: string;
  /** micro-units: integer count of 1e-8 alpha, null when unknown */
  totalEarnedUnits: number | null;
  todayUnits: number | null;
  pendingUnits: number | null;
  frozenUnits: number | null;
  minimumPayoutUnits: number | null;
  paidUnits?: number | null;
  totalsFetchedAt?: number | null;
  historyFetchedAt?: number | null;
  totalsError?: string | null;
  historyError?: string | null;
  accountingDay?: number;
  historyCount: number;
  recent: Array<{ timestamp: number; units: number; status: string }>;
  fetchedAt: number | null;
  error: string | null;
};

export type DiscoveredDevice = {
  fetchedAt: number | null;
  hotkey: string;
  miner: MinerRecord | null;
  /** run ids in which this hotkey appeared in the current sample */
  runIds: string[];
  stale?: boolean;
};

export type DiscoveryResult = {
  devices: DiscoveredDevice[];
  runs: RunInfo[];
  runsTotal: number;
  runsFetched: number;
  /** true only when every active run's miner list was fetched successfully */
  fullCoverage: boolean;
  /** last time any miner list was fetched successfully from upstream */
  fetchedAt: number | null;
  errors: string[];
};
