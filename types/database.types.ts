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
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    is_premium: boolean
                    is_admin: boolean
                    maps_count: number
                    maps_limit: number
                    birth_data: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    is_premium?: boolean
                    is_admin?: boolean
                    maps_count?: number
                    maps_limit?: number
                    birth_data?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    is_premium?: boolean
                    is_admin?: boolean
                    maps_count?: number
                    maps_limit?: number
                    birth_data?: Json
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            birth_charts: {
                Row: {
                    id: string
                    user_id: string
                    name: string | null
                    birth_date: string
                    birth_time: string | null
                    birth_place: string | null
                    latitude: number | null
                    longitude: number | null
                    chart_data: Json
                    full_interpretation: string | null
                    pdf_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name?: string | null
                    birth_date: string
                    birth_time?: string | null
                    birth_place?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    chart_data?: Json
                    full_interpretation?: string | null
                    pdf_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string | null
                    birth_date?: string
                    birth_time?: string | null
                    birth_place?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    chart_data?: Json
                    full_interpretation?: string | null
                    pdf_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            coupons: {
                Row: {
                    id: string
                    code: string
                    discount_percent: number
                    active: boolean
                    max_uses: number | null
                    uses_count: number
                    expires_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    discount_percent: number
                    active?: boolean
                    max_uses?: number | null
                    uses_count?: number
                    expires_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    discount_percent?: number
                    active?: boolean
                    max_uses?: number | null
                    uses_count?: number
                    expires_at?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    status: string
                    amount: number
                    plan: string
                    coupon_code: string | null
                    mp_preference_id: string | null
                    mp_payment_id: string | null
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    status?: string
                    amount: number
                    plan?: string
                    coupon_code?: string | null
                    mp_preference_id?: string | null
                    mp_payment_id?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    status?: string
                    amount?: number
                    plan?: string
                    coupon_code?: string | null
                    mp_preference_id?: string | null
                    mp_payment_id?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            mood_logs: {
                Row: {
                    id: string
                    user_id: string
                    mood_score: number
                    note: string | null
                    moon_phase: string | null
                    moon_sign: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    mood_score: number
                    note?: string | null
                    moon_phase?: string | null
                    moon_sign?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    mood_score?: number
                    note?: string | null
                    moon_phase?: string | null
                    moon_sign?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            synastry_links: {
                Row: {
                    id: string
                    owner_id: string
                    slug: string
                    owner_chart_id: string | null
                    second_person_data: Json
                    second_person_name: string | null
                    compatibility_score: number | null
                    interpretation: string | null
                    views_count: number
                    created_at: string
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    owner_id: string
                    slug: string
                    owner_chart_id?: string | null
                    second_person_data?: Json
                    second_person_name?: string | null
                    compatibility_score?: number | null
                    interpretation?: string | null
                    views_count?: number
                    created_at?: string
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    owner_id?: string
                    slug?: string
                    owner_chart_id?: string | null
                    second_person_data?: Json
                    second_person_name?: string | null
                    compatibility_score?: number | null
                    interpretation?: string | null
                    views_count?: number
                    created_at?: string
                    completed_at?: string | null
                }
                Relationships: []
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
        CompositeTypes: Record<string, never>
    }
}
