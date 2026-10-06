import { upstreamJson } from "./upstream-json.server";
import {
  parseAkash,
  parseGolem,
  parseIo,
  parseVast,
  type Platform,
  type PrivatePlatform,
  type PlatformNode,
} from "./platforms";
import { hongKongDayStartSeconds } from "./earnings";
export function platformJson(url: string, token?: string, fetcher: typeof fetch = fetch) {
  return upstreamJson(url, { token, authErrors: !!token, maxBytes: 1000000 }, fetcher);
}
export async function readPublicPlatform(
  project: "akash" | "golem",
  id: string,
  fetcher: typeof fetch = fetch,
): Promise<PlatformNode> {
  if (project === "akash")
    return parseAkash(
      await platformJson(
        `https://console-api.akash.network/v1/providers/${encodeURIComponent(id)}`,
        undefined,
        fetcher,
      ),
      id,
    );
  const root = `https://api.stats.golem.network/v1/provider/node/${encodeURIComponent(id)}`;
  const [node, rewards] = await Promise.all([
    platformJson(root, undefined, fetcher),
    platformJson(`${root}/earnings/24`, undefined, fetcher).catch(() => null),
  ]);
  return parseGolem(node, rewards, id);
}
export async function readPrivatePlatform(
  project: PrivatePlatform,
  id: string,
  token: string,
  fetcher: typeof fetch = fetch,
  now = Date.now(),
): Promise<PlatformNode> {
  if (project === "ionet") {
    const day = new Date(now).toISOString().slice(0, 10),
      root = "https://api.io.solutions/v1";
    const [node, rewards] = await Promise.all([
      platformJson(`${root}/io-explorer/devices/${id}/details`, token, fetcher),
      platformJson(
        `${root}/io-blocks/devices/${id}/block-rewards-summary/${day}/${day}`,
        token,
        fetcher,
      ).catch(() => null),
    ]);
    return {
      ...parseIo(node, rewards, id),
      periodStart: Date.parse(day + "T00:00:00Z"),
      periodEnd: now,
    };
  }
  const params = new URLSearchParams({
    owner: "me",
    sday: String(hongKongDayStartSeconds(now) / 86400),
    eday: String(now / 86400000),
    machid: id,
  });
  const [machines, rewards] = await Promise.all([
    platformJson("https://console.vast.ai/api/v0/machines?user_id=me", token, fetcher),
    platformJson(
      `https://console.vast.ai/api/v0/users/me/machine-earnings?${params}`,
      token,
      fetcher,
    ).catch(() => null),
  ]);
  return {
    ...parseVast(machines, rewards, id),
    periodStart: hongKongDayStartSeconds(now) * 1000,
    periodEnd: now,
  };
}
