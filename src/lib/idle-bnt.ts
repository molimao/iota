import { z } from "zod";
import { validBntAddress } from "./bnt";

const address = z.string().trim().refine(validBntAddress);
const threads = z.number().int().min(1).max(4);
const device = z
  .object({ deviceId: z.string().uuid(), threads: z.number().int().min(0).max(4) })
  .strict();

export const idleBntConfig = z.object({ address, devices: z.array(device) }).strict();
export const savedIdleBntConfig = idleBntConfig.extend({
  address: z.union([address, z.literal("")]),
});
export type IdleBntConfig = z.infer<typeof savedIdleBntConfig>;

// Keep the existing heartbeat shape so the Agent applies its local memory guard.
export const idleBntLeaseSettings = z
  .object({
    address,
    threads,
    memoryMb: z.number().int(),
    whenQueued: z.literal(true),
    whenPaused: z.literal(true),
  })
  .strict();

export const idleBntStatus = z
  .object({
    state: z.enum([
      "setup",
      "install_needed",
      "installing",
      "install_error",
      "off",
      "waiting",
      "priority",
      "mining",
      "starting",
      "memory",
      "busy",
      "error",
    ]),
    hashrate: z.number().finite().min(0).max(1e15).nullable(),
  })
  .strict();
