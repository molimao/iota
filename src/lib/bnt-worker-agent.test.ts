import { expect, it } from "vitest";
import { bntWorkerAgentBinding } from "./bnt-worker-agent";
import { bntTotals } from "./bnt-dashboard";
import type { FleetDevice } from "./fleet";
const devices: FleetDevice[] = [
  {
    id: "wallet",
    name: "Wallet",
    hardware: "",
    createdAt: 1,
    bindings: [{ id: "w", project: "bnt", identifier: "address", worker: "" }],
  },
  {
    id: "mini",
    name: "Mac mini",
    hardware: "",
    createdAt: 1,
    bindings: [{ id: "a", project: "bnt", identifier: "address", worker: "worker-A" }],
  },
  {
    id: "pro",
    name: "MacBook Pro",
    hardware: "",
    createdAt: 1,
    bindings: [{ id: "b", project: "bnt", identifier: "address", worker: "worker-B" }],
  },
];
it("matches exact wallet and Worker, never falling back to the wallet's computer", () => {
  expect(bntWorkerAgentBinding(devices, "address", "worker-A")?.device.id).toBe("mini");
  expect(bntWorkerAgentBinding(devices, "address", "worker-B")?.device.id).toBe("pro");
  for (const [address, worker] of [
    ["other", "worker-A"],
    ["address", "worker-C"],
    ["address", ""],
  ])
    expect(bntWorkerAgentBinding(devices, address!, worker!)).toBeUndefined();
});
it("adding two Worker associations does not duplicate wallet money or pool hashrate", () => {
  const rows = devices.map((d) => ({
    id: d.bindings[0]!.id,
    name: d.name,
    address: "address",
    worker: d.bindings[0]!.worker,
    result: {
      error: null,
      stale: false,
      fetchedAt: 1,
      data: {
        hashrate: 10,
        balance: 2,
        paid: 5,
        pendingEstimate: 1,
        queued: 0,
        reward: null,
        period: "unknown" as const,
        partial: false,
        workerCount: 0,
        workers: [],
      },
    },
  }));
  expect(bntTotals(rows)).toMatchObject({
    hashrate: { value: 10, total: 1 },
    balance: { value: 2, total: 1 },
    paid: { value: 5, total: 1 },
  });
});
