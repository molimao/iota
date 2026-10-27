export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      user_devices: {
        Row: {
          added_at: string
          hotkey: string
          id: string
          label: string
          user_id: string
        }
        Insert: {
          added_at?: string
          hotkey: string
          id?: string
          label: string
          user_id: string
        }
        Update: {
          added_at?: string
          hotkey?: string
          id?: string
          label?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_agent_ai_preferences: {
        Row: {
          locale: string
          user_id: string
        }
        Insert: {
          locale: string
          user_id: string
        }
        Update: {
          locale?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_agent_batch_items: {
        Row: {
          batch_id: string
          command_id: string | null
          device_id: string
          device_name: string
          disposition: string
        }
        Insert: {
          batch_id: string
          command_id?: string | null
          device_id: string
          device_name: string
          disposition: string
        }
        Update: {
          batch_id?: string
          command_id?: string | null
          device_id?: string
          device_name?: string
          disposition?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_agent_batch_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "watch_agent_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watch_agent_batch_items_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "watch_agent_commands"
            referencedColumns: ["id"]
          },
        ]
      }
      watch_agent_batches: {
        Row: {
          action: string
          created_at: string
          id: string
          target_ids: string[]
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id: string
          target_ids: string[]
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          target_ids?: string[]
          user_id?: string
        }
        Relationships: []
      }
      watch_agent_commands: {
        Row: {
          action: string
          created_at: string
          device_id: string
          expires_at: string
          finished_at: string | null
          id: string
          status: string
        }
        Insert: {
          action: string
          created_at?: string
          device_id: string
          expires_at?: string
          finished_at?: string | null
          id?: string
          status?: string
        }
        Update: {
          action?: string
          created_at?: string
          device_id?: string
          expires_at?: string
          finished_at?: string | null
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_agent_commands_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "watch_device_agents"
            referencedColumns: ["device_id"]
          },
        ]
      }
      watch_agent_crash_analyses: {
        Row: {
          attempts: number
          available_at: string
          created_at: string
          device_id: string
          fingerprint: string
          finished_at: string | null
          id: string
          lease: string | null
          lease_until: string | null
          locale: string
          logs: string | null
          result: Json | null
          status: string
          user_id: string
        }
        Insert: {
          attempts?: number
          available_at?: string
          created_at?: string
          device_id: string
          fingerprint: string
          finished_at?: string | null
          id?: string
          lease?: string | null
          lease_until?: string | null
          locale: string
          logs?: string | null
          result?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          attempts?: number
          available_at?: string
          created_at?: string
          device_id?: string
          fingerprint?: string
          finished_at?: string | null
          id?: string
          lease?: string | null
          lease_until?: string | null
          locale?: string
          logs?: string | null
          result?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_agent_crash_analyses_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "watch_device_agents"
            referencedColumns: ["device_id"]
          },
        ]
      }
      watch_agent_history: {
        Row: {
          bucket: string
          device_id: string
          sampled_at: string
          snapshot: Json
          user_id: string
        }
        Insert: {
          bucket: string
          device_id: string
          sampled_at: string
          snapshot: Json
          user_id: string
        }
        Update: {
          bucket?: string
          device_id?: string
          sampled_at?: string
          snapshot?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_agent_history_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "watch_device_agents"
            referencedColumns: ["device_id"]
          },
        ]
      }
      watch_agent_pairs: {
        Row: {
          device_id: string
          expires_at: string
          token_hash: string
          user_id: string
        }
        Insert: {
          device_id: string
          expires_at: string
          token_hash: string
          user_id: string
        }
        Update: {
          device_id?: string
          expires_at?: string
          token_hash?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_agent_pairs_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: true
            referencedRelation: "watch_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      watch_alert_states: {
        Row: {
          bad_count: number
          first_bad: string | null
          healthy_seen: boolean
          last_at: string
          notified: boolean
          resource: string
          user_id: string
        }
        Insert: {
          bad_count?: number
          first_bad?: string | null
          healthy_seen?: boolean
          last_at: string
          notified?: boolean
          resource: string
          user_id: string
        }
        Update: {
          bad_count?: number
          first_bad?: string | null
          healthy_seen?: boolean
          last_at?: string
          notified?: boolean
          resource?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_billing: {
        Row: {
          cancel_at_period_end: boolean
          checkout_expires_at: string | null
          checkout_interval: string | null
          checkout_locale: string | null
          checkout_session: string | null
          checkout_token: string | null
          period_end: string | null
          status: string | null
          stripe_customer: string | null
          stripe_event_created: number
          stripe_subscription: string | null
          synced_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          checkout_expires_at?: string | null
          checkout_interval?: string | null
          checkout_locale?: string | null
          checkout_session?: string | null
          checkout_token?: string | null
          period_end?: string | null
          status?: string | null
          stripe_customer?: string | null
          stripe_event_created?: number
          stripe_subscription?: string | null
          synced_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          checkout_expires_at?: string | null
          checkout_interval?: string | null
          checkout_locale?: string | null
          checkout_session?: string | null
          checkout_token?: string | null
          period_end?: string | null
          status?: string | null
          stripe_customer?: string | null
          stripe_event_created?: number
          stripe_subscription?: string | null
          synced_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      watch_bindings: {
        Row: {
          device_id: string
          id: string
          identifier: string
          pool: string
          project: string
          user_id: string
          worker: string
        }
        Insert: {
          device_id: string
          id?: string
          identifier: string
          pool?: string
          project: string
          user_id: string
          worker?: string
        }
        Update: {
          device_id?: string
          id?: string
          identifier?: string
          pool?: string
          project?: string
          user_id?: string
          worker?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_bindings_device_id_user_id_fkey"
            columns: ["device_id", "user_id"]
            isOneToOne: false
            referencedRelation: "watch_devices"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      watch_bnt_worker_samples: {
        Row: {
          address: string
          bucket: string
          observed_at: string
          user_id: string
          workers: Json
        }
        Insert: {
          address: string
          bucket: string
          observed_at: string
          user_id: string
          workers: Json
        }
        Update: {
          address?: string
          bucket?: string
          observed_at?: string
          user_id?: string
          workers?: Json
        }
        Relationships: []
      }
      watch_bulk_receipts: {
        Row: {
          created_at: string
          digest: string
          request: string
          user_id: string
        }
        Insert: {
          created_at?: string
          digest: string
          request: string
          user_id: string
        }
        Update: {
          created_at?: string
          digest?: string
          request?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_connections: {
        Row: {
          ciphertext: string
          expires_at: string
          project: string
          revision: string
          user_id: string
        }
        Insert: {
          ciphertext: string
          expires_at: string
          project: string
          revision?: string
          user_id: string
        }
        Update: {
          ciphertext?: string
          expires_at?: string
          project?: string
          revision?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_device_agents: {
        Row: {
          credential_hash: string
          device_id: string
          last_seen: string | null
          logs_enabled: boolean
          paired_at: string
          recovery_enabled: boolean
          snapshot: Json
          user_id: string
        }
        Insert: {
          credential_hash: string
          device_id: string
          last_seen?: string | null
          logs_enabled?: boolean
          paired_at?: string
          recovery_enabled?: boolean
          snapshot?: Json
          user_id: string
        }
        Update: {
          credential_hash?: string
          device_id?: string
          last_seen?: string | null
          logs_enabled?: boolean
          paired_at?: string
          recovery_enabled?: boolean
          snapshot?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_device_agents_device_id_user_id_fkey"
            columns: ["device_id", "user_id"]
            isOneToOne: false
            referencedRelation: "watch_devices"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      watch_devices: {
        Row: {
          created_at: string
          hardware: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hardware?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          hardware?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_history_backfills: {
        Row: {
          available_at: string
          batch: string
          bindings: Json
          created_at: string
          cursor: number
          data: Json
          day_cursor: number
          end_day: string
          error_code: string | null
          failures: number
          id: string
          inserted: number
          lease: string | null
          lease_until: string | null
          locale: string
          start_day: string
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_at?: string
          batch: string
          bindings: Json
          created_at?: string
          cursor?: number
          data?: Json
          day_cursor?: number
          end_day: string
          error_code?: string | null
          failures?: number
          id?: string
          inserted?: number
          lease?: string | null
          lease_until?: string | null
          locale?: string
          start_day: string
          status?: string
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_at?: string
          batch?: string
          bindings?: Json
          created_at?: string
          cursor?: number
          data?: Json
          day_cursor?: number
          end_day?: string
          error_code?: string | null
          failures?: number
          id?: string
          inserted?: number
          lease?: string | null
          lease_until?: string | null
          locale?: string
          start_day?: string
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_log_analyses: {
        Row: {
          created_at: string
          digest: string
          finished_at: string | null
          id: string
          project: string
          request_id: string
          result: Json | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          digest: string
          finished_at?: string | null
          id?: string
          project: string
          request_id: string
          result?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          digest?: string
          finished_at?: string | null
          id?: string
          project?: string
          request_id?: string
          result?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_payment_notifications: {
        Row: {
          attempts: number
          invoice_id: string
          lease: string | null
          lease_until: string | null
          next_at: string
          payload: Json
          sent_at: string | null
          state: string
        }
        Insert: {
          attempts?: number
          invoice_id: string
          lease?: string | null
          lease_until?: string | null
          next_at?: string
          payload: Json
          sent_at?: string | null
          state?: string
        }
        Update: {
          attempts?: number
          invoice_id?: string
          lease?: string | null
          lease_until?: string | null
          next_at?: string
          payload?: Json
          sent_at?: string | null
          state?: string
        }
        Relationships: []
      }
      watch_pro_history: {
        Row: {
          created_at: string
          day: string
          device_reports: Json
          report: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          day: string
          device_reports?: Json
          report: Json
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          device_reports?: Json
          report?: Json
          user_id?: string
        }
        Relationships: []
      }
      watch_pro_preferences: {
        Row: {
          alerts: boolean
          locale: string
          monthly: boolean
          recipient: string
          revision: string
          unsubscribe_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alerts?: boolean
          locale: string
          monthly?: boolean
          recipient: string
          revision?: string
          unsubscribe_token?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alerts?: boolean
          locale?: string
          monthly?: boolean
          recipient?: string
          revision?: string
          unsubscribe_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_pro_tasks: {
        Row: {
          attempts: number
          available_at: string
          bindings: Json
          created_at: string
          cursor: number
          data: Json
          id: string
          kind: string
          lease: string | null
          lease_until: string | null
          locale: string
          provider_id: string | null
          recipient: string | null
          revision: string | null
          status: string
          task_key: string
          user_id: string
        }
        Insert: {
          attempts?: number
          available_at?: string
          bindings?: Json
          created_at?: string
          cursor?: number
          data?: Json
          id?: string
          kind: string
          lease?: string | null
          lease_until?: string | null
          locale?: string
          provider_id?: string | null
          recipient?: string | null
          revision?: string | null
          status?: string
          task_key: string
          user_id: string
        }
        Update: {
          attempts?: number
          available_at?: string
          bindings?: Json
          created_at?: string
          cursor?: number
          data?: Json
          id?: string
          kind?: string
          lease?: string | null
          lease_until?: string | null
          locale?: string
          provider_id?: string | null
          recipient?: string | null
          revision?: string | null
          status?: string
          task_key?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_project_requests: {
        Row: {
          created_at: string
          description: string
          id: string
          locale: string
          official_url: string
          project_name: string
          request_id: string
          submitted_day: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          locale: string
          official_url: string
          project_name: string
          request_id: string
          submitted_day?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          locale?: string
          official_url?: string
          project_name?: string
          request_id?: string
          submitted_day?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_report_jobs: {
        Row: {
          attempts: number
          available_at: string
          bindings: Json
          created_at: string
          cursor: number
          device_count: number
          error_code: string | null
          id: string
          lease_token: string | null
          lease_until: string | null
          locale: string
          payload: Json | null
          provider_id: string | null
          readings: Json
          recipient: string
          report_day: string
          revision: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          attempts?: number
          available_at?: string
          bindings: Json
          created_at?: string
          cursor?: number
          device_count: number
          error_code?: string | null
          id?: string
          lease_token?: string | null
          lease_until?: string | null
          locale: string
          payload?: Json | null
          provider_id?: string | null
          readings?: Json
          recipient: string
          report_day: string
          revision: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          attempts?: number
          available_at?: string
          bindings?: Json
          created_at?: string
          cursor?: number
          device_count?: number
          error_code?: string | null
          id?: string
          lease_token?: string | null
          lease_until?: string | null
          locale?: string
          payload?: Json | null
          provider_id?: string | null
          readings?: Json
          recipient?: string
          report_day?: string
          revision?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_report_preferences: {
        Row: {
          enabled: boolean
          enabled_at: string
          locale: string
          recipient: string
          revision: string
          unsubscribe_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          enabled?: boolean
          enabled_at?: string
          locale: string
          recipient: string
          revision?: string
          unsubscribe_token?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          enabled?: boolean
          enabled_at?: string
          locale?: string
          recipient?: string
          revision?: string
          unsubscribe_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_stripe_events: {
        Row: {
          id: string
          received_at: string
        }
        Insert: {
          id: string
          received_at?: string
        }
        Update: {
          id?: string
          received_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      watch_agent_analysis_locale: {
        Args: { p_locale: string }
        Returns: undefined
      }
      watch_agent_analysis_read: {
        Args: { p_device: string; p_locale: string }
        Returns: Json
      }
      watch_agent_analysis_worker: {
        Args: {
          p_action: string
          p_id?: string
          p_lease?: string
          p_result?: Json
        }
        Returns: Json
      }
      watch_agent_batch: {
        Args: { p_action: string; p_devices?: string[]; p_id?: string }
        Returns: Json
      }
      watch_agent_binding_manifest: { Args: { p_hash: string }; Returns: Json }
      watch_agent_exchange: {
        Args: { p_action: string; p_hash: string; p_payload: Json }
        Returns: Json
      }
      watch_agent_owner: {
        Args: { p_action: string; p_device?: string; p_payload?: Json }
        Returns: Json
      }
      watch_bnt_worker_history_read: {
        Args: { p_address: string }
        Returns: Json
      }
      watch_bnt_worker_history_record: {
        Args: {
          p_address: string
          p_at: string
          p_user: string
          p_workers: Json
        }
        Returns: boolean
      }
      watch_bulk_devices: {
        Args: { p_request: string; p_rows: Json }
        Returns: Json
      }
      watch_claim_report: {
        Args: { p_now: string; p_phase: string }
        Returns: Json
      }
      watch_device_history_read: { Args: { p_device: string }; Returns: Json }
      watch_enqueue_reports: { Args: { p_now: string }; Returns: number }
      watch_export_history_read: { Args: { p_device?: string }; Returns: Json }
      watch_finish_checkout: {
        Args: { p_session: string; p_token: string; p_user: string }
        Returns: undefined
      }
      watch_history_backfill_status: { Args: never; Returns: Json }
      watch_history_backfill_worker: {
        Args: { p_action: string; p_payload?: Json }
        Returns: Json
      }
      watch_history_read: { Args: never; Returns: Json }
      watch_link_bnt_worker_agent: {
        Args: { p_binding: string; p_device: string; p_worker: string }
        Returns: string
      }
      watch_link_project_agent: {
        Args: { p_binding: string; p_device: string }
        Returns: undefined
      }
      watch_list_devices: { Args: never; Returns: Json }
      watch_log_analysis: {
        Args: {
          p_action: string
          p_digest?: string
          p_project?: string
          p_request?: string
          p_result?: Json
        }
        Returns: Json
      }
      watch_mutate_device: {
        Args: { p_action: string; p_payload: Json }
        Returns: Json
      }
      watch_payment_notification_enqueue: {
        Args: { p_invoice: string; p_payload: Json }
        Returns: undefined
      }
      watch_payment_notification_worker: {
        Args: { p_action: string; p_invoice?: string; p_lease?: string }
        Returns: Json
      }
      watch_pro_status: { Args: never; Returns: Json }
      watch_pro_worker: {
        Args: { p_action: string; p_payload?: Json }
        Returns: Json
      }
      watch_project_device_limit: { Args: { p_user: string }; Returns: number }
      watch_project_request_status: { Args: never; Returns: Json }
      watch_read_agent_history: { Args: { p_device: string }; Returns: Json }
      watch_release_checkout: {
        Args: { p_token: string; p_user: string }
        Returns: undefined
      }
      watch_report_can_send: {
        Args: { p_id: string; p_lease: string; p_now: string }
        Returns: boolean
      }
      watch_report_status: { Args: never; Returns: Json }
      watch_report_unsubscribe: { Args: { p_token: string }; Returns: boolean }
      watch_reserve_checkout: {
        Args: {
          p_customer: string
          p_interval: string
          p_locale: string
          p_user: string
        }
        Returns: Json
      }
      watch_set_pro_preferences: {
        Args: { p_alerts: boolean; p_locale: string; p_monthly: boolean }
        Returns: Json
      }
      watch_set_report_preferences: {
        Args: { p_enabled: boolean; p_locale: string }
        Returns: Json
      }
      watch_submit_project_request: {
        Args: {
          p_description: string
          p_locale: string
          p_name: string
          p_request: string
          p_url: string
        }
        Returns: Json
      }
      watch_sync_subscription: {
        Args: {
          p_cancel: boolean
          p_created: number
          p_customer: string
          p_end: string
          p_event: string
          p_status: string
          p_subscription: string
          p_user: string
        }
        Returns: undefined
      }
      watch_update_report: {
        Args: {
          p_cursor: number
          p_error: string
          p_id: string
          p_lease: string
          p_payload: Json
          p_provider: string
          p_readings: Json
          p_retry_at: string
          p_status: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
