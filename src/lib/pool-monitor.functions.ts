import { createServerFn } from "@tanstack/react-start";
import {
  isPoolProject,
  validPoolAddress,
  validPoolProvider,
  validNockAddress,
  PRL_POOL_IDS,
  poolProvider,
  type PoolProvider,
  type PoolProject,
} from "./pool-projects";

export const findPearlPools = createServerFn({ method: "POST" })
  .validator((address: string) => {
    if (typeof address !== "string" || !validPoolAddress("prl", address)) throw new Error("invalid-address");
    return address;
  })
  .handler(async ({ data: address }) => {
    const { readPoolAccount } = await import("./pool-monitor.server");
    const results = await Promise.all(PRL_POOL_IDS.map(async (pool) => ({
      pool,
      result: await readPoolAccount("prl", address, pool),
    })));
    return {
      pools: results.filter(({ result }) => {
        const d = result.data;
        return d && !result.stale && !result.error &&
          (d.workerCount > 0 || [d.balance, d.paid, d.reward, d.hashrate, d.pendingEstimate].some((n) => (n ?? 0) > 0));
      }).map(({ pool }) => pool),
      incomplete: results.some(({ result }) => (result.error && result.error !== "not-found") || result.stale),
    };
  });

export const getLuckyPoolNock = createServerFn({ method: "POST" })
  .validator((address: string) => {
    if (typeof address !== "string" || !validNockAddress(address)) throw new Error("invalid-address");
    return address;
  })
  .handler(async ({ data }) => {
    const { readLuckyPoolNock } = await import("./pool-monitor.server");
    return readLuckyPoolNock(data);
  });
export const getPoolAccount = createServerFn({ method: "POST" })
  .validator(
    (input: { project: PoolProject; address: string; pool?: PoolProvider | undefined }) => {
      if (
        !isPoolProject(input?.project) ||
        typeof input.address !== "string" ||
        !validPoolAddress(input.project, input.address) ||
        !validPoolProvider(input.project, input.pool ?? poolProvider(input.project))
      )
        throw new Error("invalid-address");
      return input;
    },
  )
  .handler(async ({ data }) => {
    const { readPoolAccount } = await import("./pool-monitor.server");
    return readPoolAccount(data.project, data.address, data.pool);
  });
