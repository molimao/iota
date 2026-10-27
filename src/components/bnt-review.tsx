import { useState } from "react";
import type { BntRow } from "@/lib/bnt-dashboard";
import { BntDashboardView } from "./bnt-dashboard";
// UI-only fixtures: not inserted into the query cache, database or live source.
const samples = (): BntRow[] =>
  ["BNT wallet"].map((name, i) => ({
    id: `demo-${i}`,
    deviceId: `demo-${i}`,
    name,
    address: `demo-address-${i}`,
    worker: "",
    result: {
      error: i === 2 ? "upstream" : null,
      fetchedAt: Date.now() - (i === 2 ? 600000 : 10000),
      stale: i === 2,
      data: {
        hashrate: [42.8, 0, 18.6][i]!,
        balance: [1.24, 0.08, 0.51][i]!,
        paid: [28.46, 6.12, 19.8][i]!,
        pendingEstimate: [0.62, 0, 0.28][i]!,
        queued: i === 0 ? 0.4 : 0,
        reward: null,
        period: "unknown",
        partial: false,
        workerCount: i === 0 ? 7 : 1,
        workers:
          i === 0
            ? Array.from({ length: 7 }, (_, index) => ({
                name: `mini-cpu-${String(index + 1).padStart(2, "0")}`,
                hashrate: index === 5 ? 0 : 7.13,
                lastSeen: index === 6 ? null : Date.now() - (index === 5 ? 1800000 : 30000),
                online: index === 6 ? null : index !== 5,
              }))
            : [
                {
                  name: ["mini-cpu", "macbook", "server-cpu"][i]!,
                  hashrate: [42.8, 0, 18.6][i]!,
                  lastSeen: Date.now() - (i === 1 ? 1800000 : 30000),
                  online: i !== 1,
                },
              ],
      },
    },
  }));
export function BntReview() {
  const [rows, setRows] = useState(samples);
  return (
    <BntDashboardView
      preview
      rows={rows}
      ready
      refreshing={false}
      signedIn
      limit={5}
      targets={[]}
      onLookup={async () => {}}
      onRefresh={async () => {}}
      onLogin={async () => {}}
      onSave={async () => {
        throw new Error("invalid");
      }}
      onRemove={async (r) => setRows((old) => old.filter((x) => x.id !== r.id))}
      onRename={async (r, name) =>
        setRows((old) => old.map((x) => (x.id === r.id ? { ...x, name } : x)))
      }
    />
  );
}
