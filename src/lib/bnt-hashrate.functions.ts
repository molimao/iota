import { createServerFn } from "@tanstack/react-start";
import { validBntAddress } from "./bnt";
import { BNT_HASHRATE_RANGES, type BntHashrateRange } from "./bnt-hashrate";
export const getBntHashrateHistory = createServerFn({ method: "POST" })
  .validator((input: { address: string; range: BntHashrateRange }) => {
    if (
      typeof input?.address !== "string" ||
      !validBntAddress(input.address) ||
      !BNT_HASHRATE_RANGES.includes(input.range)
    )
      throw new Error("invalid-address");
    return { address: input.address, range: input.range };
  })
  .handler(async ({ data }) => {
    const { readBntHashrateHistory } = await import("./bnt-hashrate.server");
    return readBntHashrateHistory(data.address, data.range);
  });
