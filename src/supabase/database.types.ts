export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          date: string | null
          id: number
          remarks: string | null
          status: string | null
          time_in: string | null
          time_out: string | null
          total_hours: string | null
          user_id: string
        }
        Insert: {
          date?: string | null
          id?: never
          remarks?: string | null
          status?: string | null
          time_in?: string | null
          time_out?: string | null
          total_hours?: string | null
          user_id: string
        }
        Update: {
          date?: string | null
          id?: never
          remarks?: string | null
          status?: string | null
          time_in?: string | null
          time_out?: string | null
          total_hours?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_user_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          end_date: string
          id: number
          is_approved: boolean | null
          notes: string | null
          reason: string
          start_date: string
          user_id: string
        }
        Insert: {
          end_date: string
          id?: never
          is_approved?: boolean | null
          notes?: string | null
          reason: string
          start_date: string
          user_id: string
        }
        Update: {
          end_date?: string
          id?: never
          is_approved?: boolean | null
          notes?: string | null
          reason?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_user_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      logged_actions: {
        Row: {
          action_timestamp: string
          action_type: string
          additional_info: Json | null
          changed_fields: Json | null
          id: number
          row_data: Json | null
          schema_name: string
          statement_only: string | null
          table_name: string
          transaction_id: unknown
          user_id: string
        }
        Insert: {
          action_timestamp?: string
          action_type: string
          additional_info?: Json | null
          changed_fields?: Json | null
          id?: number
          row_data?: Json | null
          schema_name: string
          statement_only?: string | null
          table_name: string
          transaction_id?: unknown
          user_id: string
        }
        Update: {
          action_timestamp?: string
          action_type?: string
          additional_info?: Json | null
          changed_fields?: Json | null
          id?: number
          row_data?: Json | null
          schema_name?: string
          statement_only?: string | null
          table_name?: string
          transaction_id?: unknown
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logged_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_user_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logged_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logged_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          first_name: string
          id: string
          is_active?: boolean | null
          last_name: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_daily_summary: {
        Row: {
          absent_count: number | null
          earliest_time_in: string | null
          late_count: number | null
          time_in_count: number | null
          time_out_count: number | null
        }
        Relationships: []
      }
      dashboard_user_summary: {
        Row: {
          first_name: string | null
          id: string | null
          total_absents: number | null
          total_lates: number | null
          total_rendered_hours: string | null
        }
        Relationships: []
      }
      user_profile_summary: {
        Row: {
          id: string | null
          total_absents: number | null
          total_lates: number | null
          total_rendered_hours: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      audit_table: {
        Args: { target_schema: string; target_table: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      old_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "admin" | "employee"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "employee"],
    },
  },
} as const

