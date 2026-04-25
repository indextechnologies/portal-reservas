import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type Tenant      = Database['public']['Tables']['tenants']['Row'];
export type Service     = Database['public']['Tables']['tenant_services']['Row'];
export type Resource    = Database['public']['Tables']['tenant_resources']['Row'];
export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type CustomField = Database['public']['Tables']['custom_fields']['Row'];
export type ReservationStatus = Database['public']['Enums']['reservation_status'];

export type ReservationWithJoins = Reservation & {
  tenant_services:  Pick<Service,  'name' | 'color' | 'duration_minutes'> | null;
  tenant_resources: Pick<Resource, 'name' | 'type'>                       | null;
  clients:          { name: string; email: string | null; phone: string | null } | null;
};
