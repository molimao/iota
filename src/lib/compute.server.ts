import { cachedProjectRead } from "./projects-upstream.server";
import { parseGonkaNetwork, parseNosanaNetwork, parseNosanaNode } from "./compute";
import type { ComputeProject } from "./projects";
async function json(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(9000), redirect: "error" });
  if (!response.ok) throw new Error("unavailable");
  const body = await response.text();
  if (body.length > 2_000_000) throw new Error("invalid-data");
  return JSON.parse(body) as unknown;
}
export function readComputeNetwork(project: ComputeProject) {
  return cachedProjectRead(`compute:${project}`, async () => {
    if (project === "gonka")
      return parseGonkaNetwork(
        await json("http://node2.gonka.ai:8000/v1/epochs/current/participants"),
      );
    const [stats, jobs] = await Promise.all([
      json("https://api.nosana.com/jobs/stats"),
      json("https://api.nosana.com/jobs/?limit=1&state=RUNNING"),
    ]);
    return parseNosanaNetwork(stats, jobs);
  });
}
export function readNosanaNode(address: string) {
  return cachedProjectRead(`nosana:node:${address}`, async () => {
    const node = encodeURIComponent(address);
    const [stats, jobs] = await Promise.all([
      json(`https://api.nosana.com/jobs/stats?node=${node}`),
      json(`https://api.nosana.com/jobs/?limit=1&state=RUNNING&node=${node}`),
    ]);
    return parseNosanaNode(stats, jobs);
  });
}
