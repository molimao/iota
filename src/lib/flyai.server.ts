import { upstreamJson } from "./upstream-json.server";
import { parseFlyaiMonth } from "./flyai";
import { cachedProjectRead } from "./projects-upstream.server";
export function readFlyaiMonth() {
  return cachedProjectRead("flyai:month", async () => {
    return parseFlyaiMonth(await upstreamJson("https://flyai-mine.fly.dev/api/month"));
  });
}
