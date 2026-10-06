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
export async function platformJson(
  url: string,
  token?: string,
  fetcher: typeof fetch = fetch,
): Promise<unknown> {
  const response = await fetcher(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal: AbortSignal.timeout(12000),
    redirect: "error",
  });
  if (response.status === 401 || response.status === 403) throw new Error("expired");
  if (response.status === 404) throw new Error("not-found");
  if (!response.ok) throw new Error("unavailable");
  const reader = response.body?.getReader();
  if (!reader) throw new Error("invalid-data");
  let size = 0;
  const parts: Uint8Array[] = [];
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 1_000_000) {
        await reader.cancel();
        throw new Error("invalid-data");
      }
      parts.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(body));
  } catch {
    throw new Error("invalid-data");
  }
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
