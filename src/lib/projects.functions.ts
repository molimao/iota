import { createServerFn } from "@tanstack/react-start";
import { isMiningProject, validProjectAddress, type MiningProject } from "./projects";

export const getProjectNetwork = createServerFn({ method: "POST" })
  .validator((input: { project: MiningProject; force?: boolean }) => {
    if (!isMiningProject(input?.project)) throw new Error("Invalid project");
    return { project: input.project, force: input.force === true };
  })
  .handler(async ({ data }) => {
    const { readProjectNetwork } = await import("./projects-upstream.server");
    return readProjectNetwork(data.project, data.force);
  });

export const getQuantusAccount = createServerFn({ method: "POST" })
  .validator((input: { address: string; force?: boolean }) => {
    if (!validProjectAddress("quantus", input?.address)) throw new Error("Invalid public address");
    return { address: input.address, force: input.force === true };
  })
  .handler(async ({ data }) => {
    const { readQuantusAccount } = await import("./projects-upstream.server");
    return readQuantusAccount(data.address, data.force);
  });
