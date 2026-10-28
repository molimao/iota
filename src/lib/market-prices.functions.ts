import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PROJECT_IDS } from "./projects";

export const getMarketPrices = createServerFn({ method: "POST" })
  .validator(z.object({ projects: z.array(z.enum(PROJECT_IDS)).max(PROJECT_IDS.length) }))
  .handler(async ({ data }) => {
    const { marketPrices } = await import("./market-prices.server");
    return marketPrices(data.projects);
  });
