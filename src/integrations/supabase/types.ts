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
    PostgrestVersion: "14.5"
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
          project: string
          user_id: string
          worker: string
        }
        Insert: {
          device_id: string
          id?: string
          identifier: string
          project: string
          user_id: string
          worker?: string
        }
        Update: {
          device_id?: string
          id?: string
          identifier?: string
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
      watch_finish_checkout: {
        Args: { p_session: string; p_token: string; p_user: string }
        Returns: undefined
      }
      watch_list_devices: { Args: never; Returns: Json }
      watch_mutate_device: {
        Args: { p_action: string; p_payload: Json }
        Returns: Json
      }
      watch_project_device_limit: { Args: { p_user: string }; Returns: number }
      watch_project_request_status: { Args: never; Returns: Json }
      watch_release_checkout: {
        Args: { p_token: string; p_user: string }
        Returns: undefined
      }
      watch_reserve_checkout: {
        Args: {
          p_customer: string
          p_interval: string
          p_locale: string
          p_user: string
        }
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
