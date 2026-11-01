import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { HARDWARE_MODELS } from "./hardware-yield";
export const getHardwareYield = createServerFn({ method: "GET" })
  .validator(z.object({ model: z.enum(HARDWARE_MODELS) }))
  .handler(async ({ data }) => {
    const { hardwareYield } = await import("./hardware-yield.server");
    return hardwareYield(data.model);
  });
