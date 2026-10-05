import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { validBinding } from "./fleet";
import { watchDb } from "./watch-db";

import { fleetMutationSchema, fleetSnapshot, type FleetMutation } from "./fleet-policy";
export type { FleetMutation } from "./fleet-policy";

export const getFleet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await watchDb(context.supabase).rpc("watch_list_devices");
    if (error) throw new Error("fleet_read_failed");
    return fleetSnapshot(data);
  });
export const mutateFleet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: FleetMutation) => {
    const value = fleetMutationSchema.parse(input);
    if (
      "binding" in value.payload &&
      value.payload.binding &&
      !validBinding(value.payload.binding.project, value.payload.binding.identifier)
    )
      throw new Error("invalid_binding");
    return value;
  })
  .handler(async ({ context, data }) => {
    const result = await watchDb(context.supabase).rpc("watch_mutate_device", {
      p_action: data.action,
      p_payload: data.payload,
    });
    if (result.error) {
      if (result.error.message.includes("project_device_limit_reached"))
        throw new Error("project_device_limit_reached");
      if (result.error.code === "23505") throw new Error("duplicate_binding");
      throw new Error("fleet_save_failed");
    }
    return fleetSnapshot(result.data);
  });
