import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInDays, addDays } from 'date-fns'
import { COOLDOWN_DAYS, DONOR_LEVEL_THRESHOLDS, BADGE_CONFIG } from '@/lib/constants'
import { DonorLevel, BadgeType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a')
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatPhone(phone: string): string {
  if (phone.startsWith('+880')) return phone
  if (phone.startsWith('880')) return `+${phone}`
  if (phone.startsWith('0')) return `+880${phone.slice(1)}`
  return `+880${phone}`
}

export function getCooldownDaysRemaining(cooldownEndsAt: string): number {
  return Math.max(0, differenceInDays(new Date(cooldownEndsAt), new Date()))
}

export function getCooldownProgress(donatedAt: string): number {
  const donated = new Date(donatedAt)
  const end = addDays(donated, COOLDOWN_DAYS)
  const now = new Date()
  const elapsed = differenceInDays(now, donated)
  return Math.min(100, Math.round((elapsed / COOLDOWN_DAYS) * 100))
}

export function getDonorLevel(totalDonations: number): DonorLevel {
  if (totalDonations >= DONOR_LEVEL_THRESHOLDS.hero) return 'hero'
  if (totalDonations >= DONOR_LEVEL_THRESHOLDS.gold) return 'gold'
  if (totalDonations >= DONOR_LEVEL_THRESHOLDS.silver) return 'silver'
  if (totalDonations >= DONOR_LEVEL_THRESHOLDS.bronze) return 'bronze'
  return 'new'
}

export function getEarnedBadges(totalDonations: number): BadgeType[] {
  return (Object.entries(BADGE_CONFIG) as [BadgeType, typeof BADGE_CONFIG[BadgeType]][])
    .filter(([, config]) => totalDonations >= config.threshold)
    .map(([type]) => type)
}

export function generateCertificateNumber(donationId: string): string {
  return `RKT-${donationId.slice(0, 8).toUpperCase()}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export function generateWhatsAppText(campaign: { title: string; venue_name: string; event_date: string; district: string }): string {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/campaigns`
  return encodeURIComponent(
    `🩸 *Blood Donation Campaign*\n\n*${campaign.title}*\n📍 ${campaign.venue_name}, ${campaign.district}\n📅 ${formatDate(campaign.event_date)}\n\nJoin us and save lives!\n${url}`
  )
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
