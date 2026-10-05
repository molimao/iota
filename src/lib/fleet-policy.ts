import { z } from "zod";
import { FLEET_PROJECTS, parseFleet } from "./fleet";

export const fleetMutationSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    payload: z.object({
      name: z.string().trim().min(1).max(40),
      hardware: z.string().trim().max(100).default(""),
      binding: z
        .object({
          project: z.enum(FLEET_PROJECTS),
          identifier: z.string().trim().min(1).max(100),
          worker: z.string().trim().max(80).default(""),
        })
        .optional(),
    }),
  }),
  z.object({
    action: z.literal("rename"),
    payload: z.object({
      id: z.string().uuid(),
      name: z.string().trim().min(1).max(40),
      hardware: z.string().trim().max(100).default(""),
    }),
  }),
  z.object({ action: z.literal("remove"), payload: z.object({ id: z.string().uuid() }) }),
  z.object({
    action: z.literal("unlink"),
    payload: z.object({ id: z.string().uuid(), bindingId: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("merge"),
    payload: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
  }),
  z.object({
    action: z.literal("link"),
    payload: z.object({
      id: z.string().uuid(),
      binding: z.object({
        project: z.enum(FLEET_PROJECTS),
        identifier: z.string().trim().min(1).max(100),
        worker: z.string().trim().max(80).default(""),
      }),
    }),
  }),
]);
export type FleetMutation = z.infer<typeof fleetMutationSchema>;
export function fleetSnapshot(input: unknown) {
  const snapshot = z
    .object({
      devices: z.unknown(),
      plan: z.enum(["free", "pro"]),
      projectDeviceLimit: z.union([z.literal(5), z.literal(50)]),
      quotaScope: z.literal("per_project"),
    })
    .parse(input);
  if (snapshot.projectDeviceLimit !== (snapshot.plan === "pro" ? 50 : 5))
    throw new Error("invalid-fleet-plan");
  return { ...snapshot, devices: parseFleet(snapshot.devices) };
}
