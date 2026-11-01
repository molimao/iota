// Only aggregate hardware and daily statistics are written to the public snapshot.
// Inputs are authorized anonymized history files, never Agent credentials or logs.
import { z } from "zod";
import { readFile, writeFile } from "node:fs/promises";
import { blocknetHardwareRows } from "../src/lib/blocknet-hardware.ts";
import {
  bntNetworkSchema,
  summarizeIotaDays,
  hardwareYieldSchema,
} from "../src/lib/hardware-yield.ts";
const stats = bntNetworkSchema.parse(await (await fetch("https://bntpool.com/api/stats")).json());
const result = blocknetHardwareRows(stats.chain.current_job_height, stats.chain.network_hashrate);
const price = JSON.parse(await readFile("/tmp/iota-calc-price.json", "utf8"))["iota-2"].usd;
if (!(price > 0)) throw Error("SN9 quote required");
const end = Math.floor(Date.now() / 86400000) * 86400000;
for (const [model, path] of [
  ["m1-pro-32", "/tmp/iota-m1-pro-32-history.json"],
  ["m4-16", "/tmp/iota-m4-history.json"],
]) {
  const history = z
    .object({
      alpha_amounts: z.array(z.number().nonnegative()),
      timestamps: z.array(z.number().nonnegative()),
      statuses: z.array(z.string()),
    })
    .refine(
      (h) =>
        h.alpha_amounts.length === h.timestamps.length && h.statuses.length === h.timestamps.length,
    )
    .parse(JSON.parse(await readFile(path, "utf8")));
  const observed = summarizeIotaDays(history, end);
  result.push({
    model,
    fetchedAt: Date.now(),
    source: "https://iota-web.api.macrocosmos.ai/docs",
    rows: [
      {
        project: "iota",
        unit: "IOTA",
        algorithm: "Train at Home",
        hashrate: null,
        watts: null,
        basis: "observed",
        ...observed,
        usdPerDay: observed.coinsPerDay * price,
        source: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
    ],
  });
}
await writeFile(
  new URL("../src/lib/mac-yield-snapshot.json", import.meta.url),
  JSON.stringify(
    result.map((x) => hardwareYieldSchema.parse(x)),
    null,
    2,
  ) + "\n",
);
console.log(
  result.map((x) => ({ model: x.model, coins: x.rows[0].coinsPerDay, usd: x.rows[0].usdPerDay })),
);
