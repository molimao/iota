import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";

export type BillingRow = {
  user_id: string;
  stripe_customer: string | null;
  stripe_subscription: string | null;
  status: string | null;
  period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_event_created: number;
  synced_at: string | null;
  checkout_token: string | null;
  checkout_expires_at: string | null;
  checkout_session: string | null;
  checkout_interval: string | null;
  checkout_locale: string | null;
};
type Table<R> = { Row: R; Insert: Partial<R>; Update: Partial<R>; Relationships: [] };
export type WatchDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Functions"> & {
    Tables: Database["public"]["Tables"] & {
      watch_billing: Table<BillingRow>;
      watch_connections: Table<{
        user_id: string;
        project: string;
        ciphertext: string;
        revision: string;
        expires_at: string;
      }>;
    };
    Functions: {
      watch_report_status: { Args: Record<string, never>; Returns: Json };
      watch_set_report_preferences: {
        Args: { p_enabled: boolean; p_locale: string };
        Returns: Json;
      };
      watch_enqueue_reports: { Args: { p_now: string }; Returns: number };
      watch_claim_report: { Args: { p_phase: string; p_now: string }; Returns: Json };
      watch_update_report: {
        Args: {
          p_id: string;
          p_lease: string;
          p_cursor: number;
          p_readings: Json;
          p_payload: Json;
          p_status: string;
          p_provider: string | null;
          p_error: string | null;
          p_retry_at: string | null;
        };
        Returns: boolean;
      };
      watch_report_can_send: {
        Args: { p_id: string; p_lease: string; p_now: string };
        Returns: boolean;
      };
      watch_report_unsubscribe: { Args: { p_token: string }; Returns: boolean };
      watch_project_request_status: { Args: Record<string, never>; Returns: Json };
      watch_submit_project_request: {
        Args: {
          p_request: string;
          p_name: string;
          p_url: string;
          p_description: string;
          p_locale: string;
        };
        Returns: Json;
      };
      watch_list_devices: { Args: Record<string, never>; Returns: Json };
      watch_mutate_device: { Args: { p_action: string; p_payload: Json }; Returns: Json };
      watch_reserve_checkout: {
        Args: { p_user: string; p_interval: string; p_customer: string; p_locale: string };
        Returns: Json;
      };
      watch_release_checkout: { Args: { p_user: string; p_token: string }; Returns: undefined };
      watch_finish_checkout: {
        Args: { p_user: string; p_token: string; p_session: string };
        Returns: undefined;
      };
      watch_sync_subscription: {
        Args: {
          p_event: string;
          p_created: number;
          p_user: string;
          p_customer: string;
          p_subscription: string;
          p_status: string;
          p_end: string | null;
          p_cancel: boolean;
        };
        Returns: undefined;
      };
    };
  };
};
/** Isolated type extension until the approved migration regenerates Supabase types. */
export function watchDb(client: SupabaseClient<Database>) {
  return client as unknown as SupabaseClient<WatchDatabase>;
}
