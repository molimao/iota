import { parseFlyaiMonth } from "./flyai";
import { cachedProjectRead } from "./projects-upstream.server";
export function readFlyaiMonth() {
  return cachedProjectRead("flyai:month", async () => {
    const response = await fetch("https://flyai-mine.fly.dev/api/month", {
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) throw new Error("unavailable");
    const text = await response.text();
    if (text.length > 2_000_000) throw new Error("invalid-data");
    return parseFlyaiMonth(JSON.parse(text));
  });
}
