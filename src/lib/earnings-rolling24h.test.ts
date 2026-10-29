import { it, expect } from "vitest";
import { iotaRolling24hUnits, buildDeviceEarnings, mergeEarnings } from "./earnings-data";
import type { EntitlementHistory } from "./iota-types";
const now = Date.parse("2026-10-29T02:00:00Z"), cutoff = now - 86400000;
const history = (times: number[], amounts = times.map(() => 1), statuses = times.map(() => "settled")): EntitlementHistory => ({ timestamps: times.map((x) => x / 1000), alpha_amounts: amounts, statuses });
it("uses a rolling 24h interval across both midnights, including now and excluding the cutoff", () => {
  const data = history([cutoff-1000, cutoff, cutoff+1000, Date.parse("2026-10-28T15:00:00Z"), Date.parse("2026-10-29T01:00:00Z"), now, now+1000]);
  expect(iotaRolling24hUnits(data, now)).toBe(400000000);
});
it("counts only recognized earned records and preserves exact integer units", () => {
  expect(iotaRolling24hUnits(history([now,now,now], [0.00000001,0.25,100], ["pending","settled","frozen"]),now)).toBe(25000001);
});
it("rejects unavailable, malformed, negative and overflowing histories; confirmed empty is zero", () => {
  expect(iotaRolling24hUnits(null, now)).toBeNull();
  expect(iotaRolling24hUnits(history([]), now)).toBe(0);
  expect(iotaRolling24hUnits(history([now], []), now)).toBeNull();
  expect(iotaRolling24hUnits(history([now], [-1]), now)).toBeNull();
  expect(iotaRolling24hUnits(history([now], [Number.MAX_SAFE_INTEGER]), now)).toBeNull();
});
it("does not claim full coverage when a capped page has only newer rows", () => {
  expect(iotaRolling24hUnits(history(Array.from({length:30},(_,i)=>now-i*1000)),now)).toBeNull();
  expect(iotaRolling24hUnits(history([cutoff,...Array.from({length:29},(_,i)=>now-i*1000)]),now)).toBe(2900000000);
});
it("does not resurrect an old rolling value when the refreshed source fails", () => {
  const failed = buildDeviceEarnings("id", {data:null,error:"unavailable",fetchedAt:null,stale:false},
    {data:history([now]),error:"unavailable",fetchedAt:now,stale:false},now);
  const old = {...failed, rolling24hUnits:999, todayUnits:1};
  expect(mergeEarnings([failed],[old])[0]?.rolling24hUnits).toBeNull();
});
