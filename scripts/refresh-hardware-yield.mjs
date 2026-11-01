// Run with the repository's Node 24 runtime. Generated snapshots retain source and retrieval time.
import { GPU_MODELS, parseHardwareYield } from "../src/lib/hardware-yield.ts";
import { writeFile } from "node:fs/promises";
const snapshots = [];
for (const model of GPU_MODELS) {
  const url = `https://pool.kryptex.com/device/gpu/nvidia/nvidia-geforce-rtx-${model}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`${model}: ${r.status}`);
  const data = parseHardwareYield(await r.text(), model);
  snapshots.push(data);
  console.log(model, data.rows.map((r) => `${r.project} $${r.usdPerDay}/day`).join(" · "));
}
await writeFile(
  new URL("../src/lib/hardware-yield-snapshot.json", import.meta.url),
  JSON.stringify(snapshots, null, 2) + "\n",
);
