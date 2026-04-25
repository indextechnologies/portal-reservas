export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      clients: {
        Row: { active: boolean; created_at: string; email: string | null; id: string; metadata: Json; name: string; notes: string | null; phone: string | null; tags: string[]; tenant_id: string; user_id: string | null }
        Insert: { active?: boolean; created_at?: string; email?: string | null; id?: string; metadata?: Json; name: string; notes?: string | null; phone?: string | null; tags?: string[]; tenant_id: string; user_id?: string | null }
        Update: { active?: boolean; created_at?: string; email?: string | null; id?: string; metadata?: Json; name?: string; notes?: string | null; phone?: string | null; tags?: string[]; tenant_id?: string; user_id?: string | null }
        Relationships: []
      }
      custom_field_values: {
        Row: { client_id: string | null; field_id: string; id: string; reservation_id: string | null; tenant_id: string; value: Json }
        Insert: { client_id?: string | null; field_id: string; id?: string; reservation_id?: string | null; tenant_id: string; value: Json }
        Update: { client_id?: string | null; field_id?: string; id?: string; reservation_id?: string | null; tenant_id?: string; value?: Json }
        Relationships: []
      }
      custom_fields: {
        Row: { active: boolean; entity: string; id: string; label: string; name: string; options: Json | null; required: boolean; sort_order: number; tenant_id: string; type: string }
        Insert: { active?: boolean; entity: string; id?: string; label: string; name: string; options?: Json | null; required?: boolean; sort_order?: number; tenant_id: string; type: string }
        Update: { active?: boolean; entity?: string; id?: string; label?: string; name?: string; options?: Json | null; required?: boolean; sort_order?: number; tenant_id?: string; type?: string }
        Relationships: []
      }
      reservations: {
        Row: { cancelled_at: string | null; cancelled_by: string | null; client_id: string | null; created_at: string; date: string; end_time: string | null; guest_email: string | null; guest_name: string | null; guest_phone: string | null; id: string; internal_notes: string | null; metadata: Json; notes: string | null; resource_id: string | null; service_id: string | null; start_time: string; status: Database['public']['Enums']['reservation_status']; tenant_id: string; updated_at: string }
        Insert: { cancelled_at?: string | null; cancelled_by?: string | null; client_id?: string | null; created_at?: string; date: string; end_time?: string | null; guest_email?: string | null; guest_name?: string | null; guest_phone?: string | null; id?: string; internal_notes?: string | null; metadata?: Json; notes?: string | null; resource_id?: string | null; service_id?: string | null; start_time: string; status?: Database['public']['Enums']['reservation_status']; tenant_id: string; updated_at?: string }
        Update: { cancelled_at?: string | null; cancelled_by?: string | null; client_id?: string | null; created_at?: string; date?: string; end_time?: string | null; guest_email?: string | null; guest_name?: string | null; guest_phone?: string | null; id?: string; internal_notes?: string | null; metadata?: Json; notes?: string | null; resource_id?: string | null; service_id?: string | null; start_time?: string; status?: Database['public']['Enums']['reservation_status']; tenant_id?: string; updated_at?: string }
        Relationships: []
      }
      resource_services: {
        Row: { resource_id: string; service_id: string }
        Insert: { resource_id: string; service_id: string }
        Update: { resource_id?: string; service_id?: string }
        Relationships: []
      }
      tenant_availability: {
        Row: { active: boolean; day_of_week: number; end_time: string; id: string; resource_id: string | null; start_time: string; tenant_id: string }
        Insert: { active?: boolean; day_of_week: number; end_time: string; id?: string; resource_id?: string | null; start_time: string; tenant_id: string }
        Update: { active?: boolean; day_of_week?: number; end_time?: string; id?: string; resource_id?: string | null; start_time?: string; tenant_id?: string }
        Relationships: []
      }
      tenant_closures: {
        Row: { date_end: string; date_start: string; id: string; reason: string | null; resource_id: string | null; tenant_id: string }
        Insert: { date_end: string; date_start: string; id?: string; reason?: string | null; resource_id?: string | null; tenant_id: string }
        Update: { date_end?: string; date_start?: string; id?: string; reason?: string | null; resource_id?: string | null; tenant_id?: string }
        Relationships: []
      }
      tenant_resources: {
        Row: { active: boolean; created_at: string; description: string | null; id: string; metadata: Json; name: string; sort_order: number; tenant_id: string; type: string }
        Insert: { active?: boolean; created_at?: string; description?: string | null; id?: string; metadata?: Json; name: string; sort_order?: number; tenant_id: string; type?: string }
        Update: { active?: boolean; created_at?: string; description?: string | null; id?: string; metadata?: Json; name?: string; sort_order?: number; tenant_id?: string; type?: string }
        Relationships: []
      }
      tenant_services: {
        Row: { active: boolean; capacity: number; color: string | null; created_at: string; currency: string | null; description: string | null; duration_minutes: number; id: string; metadata: Json; name: string; price: number | null; sort_order: number; tenant_id: string }
        Insert: { active?: boolean; capacity?: number; color?: string | null; created_at?: string; currency?: string | null; description?: string | null; duration_minutes?: number; id?: string; metadata?: Json; name: string; price?: number | null; sort_order?: number; tenant_id: string }
        Update: { active?: boolean; capacity?: number; color?: string | null; created_at?: string; currency?: string | null; description?: string | null; duration_minutes?: number; id?: string; metadata?: Json; name?: string; price?: number | null; sort_order?: number; tenant_id?: string }
        Relationships: []
      }
      tenants: {
        Row: { active: boolean; config: Json; created_at: string; currency: string; description: string | null; id: string; industry: string | null; logo_url: string | null; name: string; owner_id: string | null; slug: string; timezone: string }
        Insert: { active?: boolean; config?: Json; created_at?: string; currency?: string; description?: string | null; id?: string; industry?: string | null; logo_url?: string | null; name: string; owner_id?: string | null; slug: string; timezone?: string }
        Update: { active?: boolean; config?: Json; created_at?: string; currency?: string; description?: string | null; id?: string; industry?: string | null; logo_url?: string | null; name?: string; owner_id?: string | null; slug?: string; timezone?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { my_tenant_ids: { Args: never; Returns: string[] } }
    Enums: { reservation_status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' }
    CompositeTypes: { [_ in never]: never }
  }
}
