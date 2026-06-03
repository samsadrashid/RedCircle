'use client'

import { differenceInDays, format } from 'date-fns'
import { Progress } from '@/components/ui/progress'
import { COOLDOWN_DAYS } from '@/lib/constants'

interface Props {
  isAvailable: boolean
  cooldownEndsAt?: string | null
  donatedAt?: string | null
  size?: 'sm' | 'md'
}

export function CooldownBadge({ isAvailable, cooldownEndsAt, donatedAt, size = 'md' }: Props) {
  if (isAvailable) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span className={`font-medium text-green-600 dark:text-green-400 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          Available to Donate
        </span>
      </div>
    )
  }

  if (!cooldownEndsAt || !donatedAt) return null

  const daysRemaining = Math.max(0, differenceInDays(new Date(cooldownEndsAt), new Date()))
  const elapsed = COOLDOWN_DAYS - daysRemaining
  const progress = Math.min(100, Math.round((elapsed / COOLDOWN_DAYS) * 100))
  const endsAtFormatted = format(new Date(cooldownEndsAt), 'dd MMM yyyy')

  return (
    <div className={`space-y-2 ${size === 'sm' ? 'text-sm' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400 shrink-0" />
          <span className="font-medium text-red-600 dark:text-red-400">Rest Period</span>
        </div>
        <span className="text-sm text-gray-500">{endsAtFormatted}</span>
      </div>
      <Progress
        value={progress}
        label={`${daysRemaining} days remaining`}
        indicatorClassName={daysRemaining < 14 ? 'bg-green-500' : 'bg-[#C0392B]'}
      />
    </div>
  )
}
