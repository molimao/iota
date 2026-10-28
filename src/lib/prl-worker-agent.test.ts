import { expect, it } from "vitest";
import { poolWorkerAgentBinding } from "./bnt-worker-agent";
import { prlWalletGroups } from "./prl-worker-agent";
import { earningsBoard } from "./earnings-board";
import type { FleetDevice } from "./fleet";
const devices: FleetDevice[] = [
  {
    id: "wallet",
    name: "Wallet",
    hardware: "",
    createdAt: 1,
    bindings: [
      {
        id: "wallet-binding",
        project: "prl",
        identifier: "address",
        worker: "",
        pool: "luckypool",
      },
    ],
  },
  {
    id: "a",
    name: "Computer A",
    hardware: "",
    createdAt: 1,
    bindings: [
      { id: "a1", project: "prl", identifier: "address", worker: "gpu1", pool: "luckypool" },
    ],
  },
  {
    id: "b",
    name: "Computer B",
    hardware: "",
    createdAt: 1,
    bindings: [
      { id: "b1", project: "prl", identifier: "address", worker: "gpu2", pool: "luckypool" },
    ],
  },
  {
    id: "c",
    name: "Computer C",
    hardware: "",
    createdAt: 1,
    bindings: [
      { id: "c1", project: "prl", identifier: "address", worker: "gpu1", pool: "kryptex" },
    ],
  },
];
it("isolates PRL Worker computers by pool and never inherits wallet Agent", () => {
  expect(poolWorkerAgentBinding(devices, "prl", "address", "gpu1", "luckypool")?.device.id).toBe(
    "a",
  );
  expect(poolWorkerAgentBinding(devices, "prl", "address", "gpu2", "luckypool")?.device.id).toBe(
    "b",
  );
  expect(poolWorkerAgentBinding(devices, "prl", "address", "gpu1", "kryptex")?.device.id).toBe("c");
  expect(poolWorkerAgentBinding(devices, "prl", "address", "", "luckypool")).toBeUndefined();
  expect(poolWorkerAgentBinding(devices, "prl", "address", "missing", "luckypool")).toBeUndefined();
  expect(poolWorkerAgentBinding(devices, "prl", "other", "gpu1", "luckypool")).toBeUndefined();
  expect(poolWorkerAgentBinding(devices, "bnt", "address", "gpu1")).toBeUndefined();
});
it("groups wallet and Worker links once per pool and supports worker-only saved addresses", () => {
  const groups = prlWalletGroups(devices);
  expect(groups).toHaveLength(2);
  expect(groups.find((g) => g.binding.pool === "luckypool")?.binding.id).toBe("wallet-binding");
  expect(prlWalletGroups(devices.slice(1))).toHaveLength(2);
});
it("counts the wallet money once after two Worker links are added", () => {
  const entries = devices
    .slice(0, 3)
    .map((d) => ({
      deviceId: d.id,
      binding: d.bindings[0]!,
      data: {
        scope: "wallet" as const,
        rewardAmount: 2,
        earningsWindow: "rolling24h" as const,
        unit: "PRL",
        health: "fresh",
        source: "pool",
        updated: "now",
        accountSummary: { kind: "balance" as const, amount: "3", unit: "PRL" },
      },
    }));
  const board = earningsBoard(entries, { prl: 1.5 });
  expect([...board.projects[0]!.metrics.values()][0]).toMatchObject({ amount: 2, usd: 3 });
  expect(board.projects[0]!.accounts.size).toBe(1);
  expect(board.totals.today.count).toBe(0);
});
