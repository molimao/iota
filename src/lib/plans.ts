/** Shared display policy. The database enforces quotas independently. */
export const PLANS = {
  free: { projectDeviceLimit: 5 },
  pro: { projectDeviceLimit: 50, monthlyCents: 299, annualCents: 1699, currency: "usd" },
} as const;

export type BillingSummary = {
  plan: "free" | "pro";
  quotaScope: "per_project";
  projectDeviceLimit: number;
  configured: boolean;
  status: string | null;
  periodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  hasCustomer: boolean;
};

export function paidAccess(status: string | null, periodEnd: number | null, now = Date.now()) {
  return status === "active" && periodEnd !== null && periodEnd > now;
}

export function quotaState(count: number, limit: number) {
  // Downgrading never deletes, hides or stops monitoring existing devices.
  return { count, limit, remaining: Math.max(0, limit - count), canAdd: count < limit };
}
