export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type DonorLevel = 'new' | 'bronze' | 'silver' | 'gold' | 'hero'

export type UrgencyLevel = 'critical' | 'urgent' | 'normal'

export type RequestStatus = 'open' | 'fulfilled' | 'expired'

export type CampaignStatus = 'active' | 'fulfilled' | 'cancelled'

export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'completed'

export type VolunteerStatus = 'pending' | 'confirmed' | 'attended'

export type NotificationType =
  | 'cooldown_expired'
  | 'new_request_match'
  | 'campaign_nearby'
  | 'thank_you'
  | 'volunteer_confirmed'
  | 'badge_awarded'
  | 'request_fulfilled'

export type BadgeType =
  | 'first_drop'
  | 'bronze_heart'
  | 'silver_vein'
  | 'gold_pulse'
  | 'hero_status'

export interface Profile {
  id: string
  full_name: string
  phone: string
  email: string | null
  blood_group: BloodGroup
  nid_number: string | null
  nid_verified: boolean
  profile_photo_url: string | null
  is_available: boolean
  privacy_mode: boolean
  donor_level: DonorLevel
  total_donations: number
  district: string | null
  created_at: string
}

export interface Donation {
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
  donor?: Profile
}

export interface BloodRequest {
  id: string
  requester_id: string
  patient_name: string
  blood_group_needed: BloodGroup
  units_needed: number
  hospital_name: string
  district: string
  location_text: string
  urgency: UrgencyLevel
  status: RequestStatus
  contact_phone: string
  message: string | null
  expires_at: string
  created_at: string
  requester?: Profile
  matches?: RequestMatch[]
}

export interface Campaign {
  id: string
  organizer_id: string
  title: string
  description: string
  blood_groups_needed: BloodGroup[]
  venue_name: string
  venue_address: string
  district: string
  event_date: string
  event_time: string
  status: CampaignStatus
  volunteers_needed: number
  created_at: string
  organizer?: Profile
  volunteers?: CampaignVolunteer[]
  volunteer_count?: number
}

export interface CampaignVolunteer {
  id: string
  campaign_id: string
  donor_id: string
  joined_at: string
  status: VolunteerStatus
  donor?: Profile
}

export interface RequestMatch {
  id: string
  request_id: string
  donor_id: string
  status: MatchStatus
  matched_at: string
  thank_you_message: string | null
  donor?: Profile
  request?: BloodRequest
}

export interface Hospital {
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

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  is_read: boolean
  created_at: string
  metadata: Record<string, unknown>
}

export interface DonorBadge {
  id: string
  donor_id: string
  badge_type: BadgeType
  awarded_at: string
}

export interface PushSubscription {
  id: string
  user_id: string
  subscription: string
  created_at: string
}

export interface LeaderboardEntry {
  donor_id: string
  full_name: string
  blood_group: BloodGroup
  district: string | null
  total_donations: number
  donor_level: DonorLevel
  profile_photo_url: string | null
}

export interface DashboardStats {
  total_donors: number
  total_donations: number
  active_requests: number
  active_campaigns: number
  lives_impacted: number
}
