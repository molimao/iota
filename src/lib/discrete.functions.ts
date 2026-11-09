import { createServerFn } from "@tanstack/react-start";
import { discreteAddressKeys } from "./discrete";

export const getDiscreteNetwork = createServerFn({ method: "GET" }).handler(async () => {
  const { readDiscreteNetwork } = await import("./discrete.server");
  return readDiscreteNetwork();
});

export const lookupDiscreteAddress = createServerFn({ method: "POST" })
  .validator((input: string) => (typeof input === "string" ? input : ""))
  .handler(async ({ data }) => {
    const keys = discreteAddressKeys(data);
    if (!keys) return { status: "invalid" } as const;
    const { readDiscreteAccountNumber } = await import("./discrete.server");
    try {
      return {
        status: "valid",
        accountNumber: await readDiscreteAccountNumber(keys.view, keys.spend),
      } as const;
    } catch {
      return { status: "unavailable" } as const;
    }
  });

export const getDiscreteSoloHistory = createServerFn({ method: "POST" })
  .validator((input: { address: string; before?: number }) => {
    if (
      typeof input?.address !== "string" ||
      (input.before !== undefined &&
        (!Number.isSafeInteger(input.before) || input.before < 2 || input.before > 0xffffffff))
    )
      throw new Error("Invalid XDS history query");
    return input;
  })
  .handler(async ({ data }) => {
    const keys = discreteAddressKeys(data.address);
    if (!keys) return { status: "invalid" } as const;
    const { readDiscreteSoloHistory } = await import("./discrete.server");
    try {
      return {
        status: "valid",
        history: await readDiscreteSoloHistory(keys.spend, data.before),
      } as const;
    } catch {
      return { status: "unavailable" } as const;
    }
  });
