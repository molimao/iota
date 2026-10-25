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

it("falls back to the actual Kraken ACU/USD book when the aggregator fails", async()=>{
 const fetcher=vi.fn(async (url: string | URL | Request)=>String(url).includes("coingecko") ? new Response("",{status:429}) : Response.json({error:[],result:{ACUUSD:{a:["0.1116"],b:["0.1115"]}}}));
 const q=await readAcurastPrice(fetcher as typeof fetch);
 expect(q.usd).toBeCloseTo(.11155);expect(q.source).toContain("Kraken");expect(fetcher).toHaveBeenCalledTimes(2);
});
it("rejects crossed, zero and excessively wide fallback books",async()=>{
 for(const [ask,bid] of [["0.1","0.2"],["0","0"],["1","0.1"]]) {
  const fetcher=async (url:string|URL|Request)=>String(url).includes("coingecko") ? new Response("",{status:403}) : Response.json({error:[],result:{ACUUSD:{a:[ask],b:[bid]}}});
  await expect(readAcurastPrice(fetcher as typeof fetch)).rejects.toThrow();
 }
});

it.runIf(process.env["LIVE_ACU_PRICE"] === "1")("verifies the real Kraken fallback without using a wallet or secret", async()=>{
 const fetcher: typeof fetch=(url,init)=>String(url).includes("coingecko") ? Promise.resolve(new Response("",{status:429})) : fetch(url,init);
 const q=await readAcurastPrice(fetcher);
 expect(q.source).toContain("Kraken");expect(q.usd).toBeGreaterThan(0);expect(acurastUsd("5.23",q)).not.toBeNull();
 console.log(JSON.stringify({source:q.source,usd:q.usd,quotedAt:q.quotedAt}));
});
