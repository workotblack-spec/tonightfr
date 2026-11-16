export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          address: string | null
          area: string
          category: string
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          image_key: string
          image_url: string | null
          is_promoted: boolean
          lat: number | null
          lineup: string | null
          lng: number | null
          owner_id: string | null
          price_text: string | null
          promoted_until: string | null
          starts_at: string
          ticket_url: string | null
          title: string
          venue: string
        }
        Insert: {
          address?: string | null
          area: string
          category: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          image_key: string
          image_url?: string | null
          is_promoted?: boolean
          lat?: number | null
          lineup?: string | null
          lng?: number | null
          owner_id?: string | null
          price_text?: string | null
          promoted_until?: string | null
          starts_at: string
          ticket_url?: string | null
          title: string
          venue: string
        }
        Update: {
          address?: string | null
          area?: string
          category?: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          image_key?: string
          image_url?: string | null
          is_promoted?: boolean
          lat?: number | null
          lineup?: string | null
          lng?: number | null
          owner_id?: string | null
          price_text?: string | null
          promoted_until?: string | null
          starts_at?: string
          ticket_url?: string | null
          title?: string
          venue?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      member_pass_secrets: {
        Row: {
          pass_id: string
          secret: string
        }
        Insert: {
          pass_id: string
          secret?: string
        }
        Update: {
          pass_id?: string
          secret?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_pass_secrets_pass_id_fkey"
            columns: ["pass_id"]
            isOneToOne: true
            referencedRelation: "member_passes"
            referencedColumns: ["id"]
          },
        ]
      }
      member_pass_transfers: {
        Row: {
          created_at: string
          from_user: string
          id: string
          pass_id: string
          to_user: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          pass_id: string
          to_user: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          pass_id?: string
          to_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_pass_transfers_pass_id_fkey"
            columns: ["pass_id"]
            isOneToOne: false
            referencedRelation: "member_passes"
            referencedColumns: ["id"]
          },
        ]
      }
      member_passes: {
        Row: {
          created_at: string
          event_id: string
          holder_id: string
          id: string
          status: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          holder_id: string
          id?: string
          status?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          holder_id?: string
          id?: string
          status?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_passes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          venue_name: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          venue_name?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          venue_name?: string | null
        }
        Relationships: []
      }
      promo_requests: {
        Row: {
          city: string | null
          contact_name: string
          created_at: string
          email: string
          event_name: string | null
          id: string
          message: string | null
          phone: string | null
          plan: string | null
          user_id: string | null
          venue: string
        }
        Insert: {
          city?: string | null
          contact_name: string
          created_at?: string
          email: string
          event_name?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          plan?: string | null
          user_id?: string | null
          venue: string
        }
        Update: {
          city?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          event_name?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          plan?: string | null
          user_id?: string | null
          venue?: string
        }
        Relationships: []
      }
      table_requests: {
        Row: {
          contact_name: string
          created_at: string
          event_id: string
          guests: number
          id: string
          note: string | null
          phone: string
          status: string
          user_id: string
          zone: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          event_id: string
          guests?: number
          id?: string
          note?: string | null
          phone: string
          status?: string
          user_id: string
          zone?: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          event_id?: string
          guests?: number
          id?: string
          note?: string | null
          phone?: string
          status?: string
          user_id?: string
          zone?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          canton: string
          city: string
          cloakroom: string | null
          created_at: string
          dress_code: string | null
          id: string
          min_age: number
          name: string
          owner_id: string
          table_min_spend: string | null
          updated_at: string
          vip_rules: string | null
        }
        Insert: {
          canton?: string
          city?: string
          cloakroom?: string | null
          created_at?: string
          dress_code?: string | null
          id?: string
          min_age?: number
          name: string
          owner_id: string
          table_min_spend?: string | null
          updated_at?: string
          vip_rules?: string | null
        }
        Update: {
          canton?: string
          city?: string
          cloakroom?: string | null
          created_at?: string
          dress_code?: string | null
          id?: string
          min_age?: number
          name?: string
          owner_id?: string
          table_min_spend?: string | null
          updated_at?: string
          vip_rules?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _pass_code: { Args: { _pass: string; _step: number }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      issue_member_pass: { Args: { _event_id: string }; Returns: string }
      member_pass_code: {
        Args: { _pass_id: string }
        Returns: {
          code: string
          expires_at: string
        }[]
      }
      sync_cron_secret_to_vault: {
        Args: { _value: string }
        Returns: undefined
      }
      transfer_member_pass: {
        Args: { _email: string; _pass_id: string }
        Returns: undefined
      }
      unaccent: { Args: { "": string }; Returns: string }
      validate_member_pass: {
        Args: { _code: string }
        Returns: {
          event_title: string
          result: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "venue" | "user"
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
    Enums: {
      app_role: ["admin", "venue", "user"],
    },
  },
} as const

