export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string
          email: string | null
          blood_group: string
          nid_number: string | null
          nid_verified: boolean
          profile_photo_url: string | null
          is_available: boolean
          privacy_mode: boolean
          donor_level: string
          total_donations: number
          district: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone: string
          email?: string | null
          blood_group: string
          nid_number?: string | null
          nid_verified?: boolean
          profile_photo_url?: string | null
          is_available?: boolean
          privacy_mode?: boolean
          donor_level?: string
          total_donations?: number
          district?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      donations: {
        Row: {
          id: string
          donor_id: string
          donated_at: string
          hospital_name: string
          location_text: string
          district: string
          notes: string | null
          cooldown_ends_at: string
          certificate_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          donated_at: string
          hospital_name: string
          location_text: string
          district: string
          notes?: string | null
          cooldown_ends_at: string
          certificate_url?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['donations']['Insert']>
      }
      blood_requests: {
        Row: {
          id: string
          requester_id: string
          patient_name: string
          blood_group_needed: string
          units_needed: number
          hospital_name: string
          district: string
          location_text: string
          urgency: string
          status: string
          contact_phone: string
          message: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          patient_name: string
          blood_group_needed: string
          units_needed: number
          hospital_name: string
          district: string
          location_text: string
          urgency: string
          status?: string
          contact_phone: string
          message?: string | null
          expires_at?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['blood_requests']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          organizer_id: string
          title: string
          description: string
          blood_groups_needed: string[]
          venue_name: string
          venue_address: string
          district: string
          event_date: string
          event_time: string
          status: string
          volunteers_needed: number
          created_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          title: string
          description: string
          blood_groups_needed: string[]
          venue_name: string
          venue_address: string
          district: string
          event_date: string
          event_time: string
          status?: string
          volunteers_needed: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      campaign_volunteers: {
        Row: {
          id: string
          campaign_id: string
          donor_id: string
          joined_at: string
          status: string
        }
        Insert: {
          id?: string
          campaign_id: string
          donor_id: string
          joined_at?: string
          status?: string
        }
        Update: Partial<Database['public']['Tables']['campaign_volunteers']['Insert']>
      }
      request_matches: {
        Row: {
          id: string
          request_id: string
          donor_id: string
          status: string
          matched_at: string
          thank_you_message: string | null
        }
        Insert: {
          id?: string
          request_id: string
          donor_id: string
          status?: string
          matched_at?: string
          thank_you_message?: string | null
        }
        Update: Partial<Database['public']['Tables']['request_matches']['Insert']>
      }
      hospitals: {
        Row: {
          id: string
          name: string
          district: string
          address: string
          lat: number
          lng: number
          phone: string
          emergency_phone: string | null
          has_blood_bank: boolean
          is_24hr: boolean
          ambulance_numbers: string[]
        }
        Insert: {
          id?: string
          name: string
          district: string
          address: string
          lat: number
          lng: number
          phone: string
          emergency_phone?: string | null
          has_blood_bank?: boolean
          is_24hr?: boolean
          ambulance_numbers?: string[]
        }
        Update: Partial<Database['public']['Tables']['hospitals']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          is_read: boolean
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body: string
          is_read?: boolean
          created_at?: string
          metadata?: Json
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      donor_badges: {
        Row: {
          id: string
          donor_id: string
          badge_type: string
          awarded_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          badge_type: string
          awarded_at?: string
        }
        Update: Partial<Database['public']['Tables']['donor_badges']['Insert']>
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['push_subscriptions']['Insert']>
      }
    }
  }
}
