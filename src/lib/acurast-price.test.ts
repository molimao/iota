import { expect, it, vi } from "vitest";
import { readAcurastPrice } from "./acurast-price.server";
import { acurastUsd } from "./acurast-rewards";
it("uses the ACU asset and its actual quote timestamp", async () => {
  const at = Math.floor(Date.now()/1000);
  const fetcher = vi.fn(async () => Response.json({acurast:{usd:0.113,last_updated_at:at}}));
  const q = await readAcurastPrice(fetcher as typeof fetch);
  expect(q.quotedAt).toBe(at*1000);
  expect(fetcher.mock.calls[0]).toBeDefined();
  expect(acurastUsd("5.23",q)).toBeCloseTo(.59099);
  expect(acurastUsd("0",q)).toBe(0);
});
it("leaves stale, future, invalid and missing quotes unavailable", async () => {
  const now = Date.now();
  for(const q of [undefined,{usd:0,quotedAt:now,source:"test"},{usd:.1,quotedAt:now-900001,source:"test"},{usd:.1,quotedAt:now+60001,source:"test"}]) expect(acurastUsd(5,q,now)).toBeNull();
  const fetcher = async () => Response.json({acurast:{usd:.1,last_updated_at:1}});
  await expect(readAcurastPrice(fetcher as typeof fetch)).rejects.toThrow();
  await expect(readAcurastPrice((async () => new Response("",{status:429})) as typeof fetch)).rejects.toThrow();
});
