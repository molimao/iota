import { createServerFn } from "@tanstack/react-start";
import {
  isPoolProject,
  validPoolAddress,
  validPoolProvider,
  poolProvider,
  type PoolProvider,
  type PoolProject,
} from "./pool-projects";
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
