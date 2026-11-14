import { z } from "zod";

export const idleXdsConfig = z
  .object({
    devices: z.array(
      z
        .object({
          deviceId: z.string().uuid(),
          threads: z.number().int().min(0).max(4),
        })
        .strict(),
    ),
  })
  .strict();
export type IdleXdsConfig = z.infer<typeof idleXdsConfig>;
export const idleXdsLease = z
  .object({
    settings: z
      .object({
        threads: z.number().int().min(1).max(4),
        whenQueued: z.literal(true),
        whenPaused: z.literal(true),
      })
      .strict(),
    seconds: z.number().int().min(1).max(45),
  })
  .strict();

export const xdsPublicKey = z
  .string()
  .max(1024)
  .regex(/^-----BEGIN PUBLIC KEY-----\n[A-Za-z0-9+/=\n]+-----END PUBLIC KEY-----\n?$/);
export const xdsPacket = z
  .object({
    key: z.string().max(1024),
    iv: z.string().max(32),
    data: z.string().max(100000),
    tag: z.string().max(64),
  })
  .strict();
export const sharedXdsSettings = z.object({
  wallet: z.object({ id: z.string().uuid(), address: z.string().nullable() }).nullable(),
  devices: idleXdsConfig.shape.devices,
  receivers: z.array(
    z.object({ deviceId: z.string().uuid(), available: z.boolean(), applied: z.boolean() }),
  ),
  backup: z.object({ id: z.string().uuid(), packet: xdsPacket.nullable() }).nullable(),
});
export type SharedXdsSettings = z.infer<typeof sharedXdsSettings>;
export const xdsWalletAgentMessage = z.discriminatedUnion("action", [
  z.object({ action: z.literal("poll"), publicKey: xdsPublicKey }).strict(),
  z
    .object({
      action: z.literal("source"),
      walletId: z.string().uuid(),
      address: z.string().startsWith("disc1").max(10000),
      envelopes: z
        .array(
          z
            .object({ deviceId: z.string().uuid(), publicKey: xdsPublicKey, packet: xdsPacket })
            .strict(),
        )
        .max(10),
      backup: z.object({ id: z.string().uuid(), packet: xdsPacket }).strict().optional(),
    })
    .strict(),
  z
    .object({
      action: z.literal("received"),
      walletId: z.string().uuid(),
      address: z.string().startsWith("disc1").max(10000),
      publicKey: xdsPublicKey,
    })
    .strict(),
]);
