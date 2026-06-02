import { cn } from '@/lib/utils'
import { BloodGroup } from '@/types'
import { BLOOD_GROUP_COLORS } from '@/lib/constants'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'blood' | 'urgency' | 'level' | 'status'
  bloodGroup?: BloodGroup
  className?: string
}

export function Badge({ children, variant = 'default', bloodGroup, className }: BadgeProps) {
  const base = 'inline-flex items-center justify-center font-semibold text-xs px-2.5 py-0.5 rounded-full'

  if (variant === 'blood' && bloodGroup) {
    return (
      <span className={cn(base, 'font-heading text-sm px-3 py-1', BLOOD_GROUP_COLORS[bloodGroup], className)}>
        {bloodGroup}
      </span>
    )
  }

  return (
    <span className={cn(base, 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300', className)}>
      {children}
    </span>
  )
}

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BloodGroupBadge({ bloodGroup, size = 'md', className }: BloodGroupBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span className={cn(
      'inline-flex items-center justify-center font-heading font-bold rounded-full',
      BLOOD_GROUP_COLORS[bloodGroup],
      sizes[size],
      className
    )}>
      {bloodGroup}
    </span>
  )
}

interface UrgencyBadgeProps {
  urgency: 'critical' | 'urgent' | 'normal'
  className?: string
}

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const config = {
    critical: { label: '🚨 Critical', className: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' },
    urgent: { label: '⚡ Urgent', className: 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800' },
    normal: { label: 'Normal', className: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800' },
  }

  const { label, className: cls } = config[urgency]
  return (
    <span className={cn('inline-flex items-center gap-1 font-semibold text-xs px-2.5 py-0.5 rounded-full', cls, className)}>
      {label}
    </span>
  )
}

interface DonorLevelBadgeProps {
  level: string
  className?: string
}

export function DonorLevelBadge({ level, className }: DonorLevelBadgeProps) {
  const config: Record<string, { label: string; className: string }> = {
    new: { label: 'New Donor', className: 'bg-gray-100 text-gray-600' },
    bronze: { label: '🥉 Bronze', className: 'bg-amber-100 text-amber-700' },
    silver: { label: '🥈 Silver', className: 'bg-gray-100 text-gray-600' },
    gold: { label: '🥇 Gold', className: 'bg-yellow-100 text-yellow-700' },
    hero: { label: '🏆 Hero', className: 'bg-purple-100 text-purple-700' },
  }

  const { label, className: cls } = config[level] || config.new
  return (
    <span className={cn('inline-flex items-center font-semibold text-xs px-2.5 py-0.5 rounded-full', cls, className)}>
      {label}
    </span>
  )
}
