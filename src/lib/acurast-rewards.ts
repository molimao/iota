/** Actual ACU transfers recorded in AcurastCompute.ManagerMetricRewards, 12 decimals.
 * Manager aggregate, never individual-device income or wallet balance. Separate
 * commitment/delegation withdrawals and migration tokens are outside this counter.
 */
export type AcurastRewards = {
  managers: { id: string; today: string | null; yesterday: string | null; cumulative: string }[];
  dayStart: number;
  observedAt: number;
  blockHash: string;
};

export type AcurastBalance = {
  address: string;
  total: string;
  free: string;
  reserved: string;
  frozen: string;
};
