import { createServerFn } from "@tanstack/react-start";
import { isPoolProject, validPoolAddress, type PoolProject } from "./pool-projects";
export const getPoolAccount = createServerFn({ method: "POST" })
  .validator((input: { project: PoolProject; address: string }) => {
    if (
      !isPoolProject(input?.project) ||
      typeof input.address !== "string" ||
      !validPoolAddress(input.project, input.address)
    )
      throw new Error("invalid-address");
    return input;
  })
  .handler(async ({ data }) => {
    const { readPoolAccount } = await import("./pool-monitor.server");
    return readPoolAccount(data.project, data.address);
  });
