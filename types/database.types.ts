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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      birth_charts: {
        Row: {
          birth_date: string
          birth_place: string | null
          birth_time: string | null
          chart_data: Json
          created_at: string | null
          full_interpretation: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string | null
          pdf_url: string | null
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place?: string | null
          birth_time?: string | null
          chart_data?: Json
          created_at?: string | null
          full_interpretation?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          pdf_url?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string | null
          birth_time?: string | null
          chart_data?: Json
          created_at?: string | null
          full_interpretation?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          pdf_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "birth_charts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          discount_percent: number
          expires_at: string | null
          id: string
          max_uses: number | null
          uses_count: number | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          discount_percent: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          uses_count?: number | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          discount_percent?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          uses_count?: number | null
        }
        Relationships: []
      }
      daily_horoscopes: {
        Row: {
          created_at: string
          date: string
          horoscope: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          horoscope: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          horoscope?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string | null
          id: string
          mood_score: number
          moon_phase: string | null
          moon_sign: string | null
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_score: number
          moon_phase?: string | null
          moon_sign?: string | null
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_score?: number
          moon_phase?: string | null
          moon_sign?: string | null
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          coupon_code: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          mp_payment_id: string | null
          mp_preference_id: string | null
          plan: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          coupon_code?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          plan?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          coupon_code?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          plan?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_data: Json | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          is_premium: boolean | null
          maps_count: number | null
          maps_limit: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_data?: Json | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          is_premium?: boolean | null
          maps_count?: number | null
          maps_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_data?: Json | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          is_premium?: boolean | null
          maps_count?: number | null
          maps_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      synastry_links: {
        Row: {
          compatibility_score: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          interpretation: string | null
          owner_chart_id: string | null
          owner_id: string
          second_person_data: Json | null
          second_person_name: string | null
          slug: string
          views_count: number | null
        }
        Insert: {
          compatibility_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          interpretation?: string | null
          owner_chart_id?: string | null
          owner_id: string
          second_person_data?: Json | null
          second_person_name?: string | null
          slug: string
          views_count?: number | null
        }
        Update: {
          compatibility_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          interpretation?: string | null
          owner_chart_id?: string | null
          owner_id?: string
          second_person_data?: Json | null
          second_person_name?: string | null
          slug?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "synastry_links_owner_chart_id_fkey"
            columns: ["owner_chart_id"]
            isOneToOne: false
            referencedRelation: "birth_charts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "synastry_links_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
