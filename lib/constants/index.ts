import { BloodGroup, DonorLevel, BadgeType } from '@/types'

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Comilla', 'Narsingdi', 'Bogura', 'Dinajpur', 'Jessore',
  'Tangail', 'Brahmanbaria', 'Noakhali', 'Faridpur', 'Jamalpur', 'Cox\'s Bazar',
  'Habiganj', 'Moulvibazar', 'Sunamganj', 'Pabna', 'Sirajganj', 'Natore', 'Chapainawabganj',
  'Joypurhat', 'Naogaon', 'Satkhira', 'Bagerhat', 'Narail', 'Magura', 'Jhenaidah',
  'Meherpur', 'Chuadanga', 'Kushtia', 'Patuakhali', 'Bhola', 'Jhalokati', 'Pirojpur',
  'Barguna', 'Gopalganj', 'Madaripur', 'Shariatpur', 'Munshiganj', 'Manikganj',
  'Kishoreganj', 'Netrokona', 'Sherpur', 'Lakshmipur', 'Feni', 'Chandpur', 'Khagrachhari',
  'Rangamati', 'Bandarban', 'Thakurgaon', 'Panchagarh', 'Nilphamari', 'Lalmonirhat',
  'Kurigram', 'Gaibandha',
]

export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
}

export const BLOOD_CAN_DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'AB+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+': ['A+', 'B+', 'O+', 'AB+'],
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
}

export const DONOR_LEVEL_THRESHOLDS: Record<DonorLevel, number> = {
  new: 0,
  bronze: 3,
  silver: 10,
  gold: 25,
  hero: 50,
}

export const BADGE_CONFIG: Record<BadgeType, { label: string; icon: string; threshold: number; description: string }> = {
  first_drop: { label: 'First Drop', icon: '🩸', threshold: 1, description: 'Donated blood for the first time' },
  bronze_heart: { label: 'Bronze Heart', icon: '🥉', threshold: 3, description: 'Donated blood 3 times' },
  silver_vein: { label: 'Silver Vein', icon: '🥈', threshold: 10, description: 'Donated blood 10 times' },
  gold_pulse: { label: 'Gold Pulse', icon: '🥇', threshold: 25, description: 'Donated blood 25 times' },
  hero_status: { label: 'Hero Status', icon: '🏆', threshold: 50, description: 'Donated blood 50 times' },
}

export const DONOR_LEVEL_LABELS: Record<DonorLevel, string> = {
  new: 'New Donor',
  bronze: 'Bronze Donor',
  silver: 'Silver Donor',
  gold: 'Gold Donor',
  hero: 'Hero',
}

export const URGENCY_COLORS = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  urgent: 'bg-orange-100 text-orange-700 border-orange-200',
  normal: 'bg-blue-100 text-blue-700 border-blue-200',
}

export const BLOOD_GROUP_COLORS: Record<BloodGroup, string> = {
  'A+': 'bg-red-100 text-red-700',
  'A-': 'bg-red-200 text-red-800',
  'B+': 'bg-blue-100 text-blue-700',
  'B-': 'bg-blue-200 text-blue-800',
  'AB+': 'bg-purple-100 text-purple-700',
  'AB-': 'bg-purple-200 text-purple-800',
  'O+': 'bg-green-100 text-green-700',
  'O-': 'bg-green-200 text-green-800',
}

export const COOLDOWN_DAYS = 90
export const REQUEST_EXPIRY_DAYS = 7
export const LIVES_PER_DONATION = 3

export const AMBULANCE_NUMBERS = [
  { name: 'DGHS National Helpline', number: '16401' },
  { name: 'Bangladesh Red Crescent', number: '01730-336699' },
  { name: 'National Emergency', number: '999' },
  { name: 'Fire Service & Civil Defense', number: '199' },
]
