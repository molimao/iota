import { expect, it, vi } from "vitest";
import { bech32m } from "@scure/base";
import {
  parseNoid,
  parseAcurast,
  validAdditionalId,
  acurastPublicKey,
} from "./additional-platforms";
import { readPublicPlatform } from "./platforms-upstream.server";
import { validBinding, bindingIdentity } from "./fleet";
import { collectReportBinding } from "./daily-report-collect.server";
const address = bech32m.encode("o", bech32m.toWords(new Uint8Array(32).fill(7)));
const key = "0x" + "ab".repeat(32);
const metric = (label: string, value: string) =>
  `<div class=e>${label}</div><div class=n>${value}</div>`;
const html =
  `<input name=a value="${address}">` +
  metric("owed (NOID)", "0.287310") +
  metric("paid (NOID)", "3.685099") +
  metric("paid (24h)", "0.000000") +
  metric("measured total", "1,70 MH/s") +
  metric("last seen", "6s ago");
it("checks NOID checksum and Acurast public keys, rejecting tokens and URLs", () => {
  expect(validBinding("noid", address)).toBe(true);
  expect(validBinding("acurast", key)).toBe(true);
  expect(validAdditionalId("noid", address.slice(0, -1) + "x")).toBe(false);
  for (const p of ["noid", "acurast"] as const)
    for (const id of ["http://127.0.0.1/", "secret", "<script>", " " + address])
      expect(validAdditionalId(p, id)).toBe(false);
  expect(bindingIdentity({ project: "acurast", identifier: key, worker: "" })).toBe(
    `acurast:${key}:`,
  );
  expect(acurastPublicKey(key)).toBe(key.slice(2));
});
it("keeps pool payouts distinct from daily earnings, scopes to the address and rejects page changes", () => {
  const p = parseNoid(html, address, 1000000);
  expect(p).toMatchObject({
    scope: "provider",
    online: true,
    sourceUpdatedAt: 994000,
    reward: 0,
    period: "rolling24h",
    rewardUnit: "NOID",
    balance: 0.28731,
    lifetime: 3.685099,
    activity: "1,70 MH/s",
  });
  expect(parseNoid(html.replace("6s ago", "81h ago"), address, 1000000000).online).toBe(false);
  expect(() => parseNoid(html, key)).toThrow();
  expect(() => parseNoid("<html>Unavailable</html>", address)).toThrow();
  expect(parseNoid(html.replace("0.000000", "unknown"), address).reward).toBeNull();
});
it("does not turn Acurast registration or account balance into uptime/rewards", () => {
  const rpc = {
    jsonrpc: "2.0",
    id: 1,
    result: {
      items: [
        {
          account_id: key,
          is_processor: true,
          device_type: "Android",
          processor_type: "Core",
          free: "999999999999999999999999",
        },
      ],
    },
  };
  expect(parseAcurast(rpc, key)).toMatchObject({
    hardware: "Android · Core",
    online: null,
    reward: null,
    lifetime: null,
    partial: false,
  });
  expect(() => parseAcurast({ ...rpc, error: { message: "failed" } }, key)).toThrow();
  expect(() => parseAcurast({ ...rpc, result: { items: [] } }, key)).toThrow("not-found");
  expect(() => parseAcurast(rpc, "0x" + "cd".repeat(32))).toThrow("not-found");
});
it("uses fixed read-only endpoints and never sends wallet credentials", async () => {
  const f = vi.fn(
    async (_url: string | URL | Request, _options?: RequestInit) => new Response(html),
  );
  expect((await readPublicPlatform("noid", address, f)).rewardUnit).toBe("NOID");
  expect(f.mock.calls[0]?.[0]).toBe(`https://www.parano1d-pool.fun/miner?a=${address}`);
  const rpc = {
    jsonrpc: "2.0",
    id: 1,
    result: { items: [{ account_id: key, is_processor: true }] },
  };
  const a = vi.fn(
    async (_url: string | URL | Request, _options?: RequestInit) =>
      new Response(JSON.stringify(rpc)),
  );
  await readPublicPlatform("acurast", key, a);
  const req = a.mock.calls[0] as unknown as [string, RequestInit];
  expect(req[0]).toBe("https://dev.indexer.mainnet.acurast.com/api/v1/rpc");
  expect(JSON.parse(String(req[1].body))).toMatchObject({
    method: "getAccounts",
    params: { account_id: key, is_processor: true, limit: 1 },
  });
  expect(req[1].headers).not.toHaveProperty("Authorization");
});
it("does not include rolling pool payments or unavailable Acurast rewards in daily reports", async () => {
  const window = { start: 0, end: 86400000 } as Parameters<typeof collectReportBinding>[2];
  expect(
    (await collectReportBinding("test", { project: "noid", identifier: address }, window)).reason,
  ).toBe("different_period");
  expect(
    (await collectReportBinding("test", { project: "acurast", identifier: key }, window)).reason,
  ).toBe("unsupported");
});
