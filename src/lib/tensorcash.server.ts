import { upstreamJson } from "./upstream-json.server";
import { parseTscBalance, validTscAddress } from "./tensorcash";
export async function readTscBalance(id: string, fetcher: typeof fetch = fetch) {
  if (!validTscAddress(id)) throw new Error("invalid-address");
  let last: unknown;
  for (const base of ["https://api.tensorcash.org", "https://api2.tensorcash.org"]) {
    try {
      return parseTscBalance(
        await upstreamJson(
          `${base}/v1/addresses/${encodeURIComponent(id)}/balance`,
          { maxBytes: 32000 },
          fetcher,
        ),
        id,
      );
    } catch (error) {
      last = error;
    }
  }
  throw last;
}
