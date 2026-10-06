import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validComputeId } from "./compute";
export const getComputeNetwork = createServerFn({ method: "POST" })
  .inputValidator(z.object({ project: z.enum(["nosana", "gonka"]) }))
  .handler(async ({ data }) => {
    const { readComputeNetwork } = await import("./compute.server");
    return readComputeNetwork(data.project);
  });
export const getNosanaNode = createServerFn({ method: "POST" })
  .inputValidator(z.object({ address: z.string().refine((id) => validComputeId("nosana", id)) }))
  .handler(async ({ data }) => {
    const { readNosanaNode } = await import("./compute.server");
    return readNosanaNode(data.address);
  });
