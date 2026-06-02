'use client'

import Link from 'next/link'
import { MapPin, Phone, CheckCircle, Clock, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { BloodGroupBadge, DonorLevelBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Profile } from '@/types'
import { cn } from '@/lib/utils'
import { DONOR_LEVEL_LABELS } from '@/lib/constants'

interface DonorCardProps {
  donor: Profile
  compact?: boolean
}

export function DonorCard({ donor, compact }: DonorCardProps) {
  return (
    <Link href={`/donor/${donor.id}`}>
      <Card hover className={cn('p-5 h-full flex flex-col gap-4', !donor.is_available && 'opacity-75')}>
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar
              src={donor.profile_photo_url}
              fallback={donor.full_name}
              size="lg"
            />
            {donor.nid_verified && (
              <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-50" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{donor.full_name}</h3>
              <BloodGroupBadge bloodGroup={donor.blood_group} size="sm" />
            </div>
            {donor.district && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{donor.district}</span>
              </div>
            )}
          </div>
        </div>

        {!compact && (
          <div className="flex items-center justify-between">
            <DonorLevelBadge level={donor.donor_level} />
            <div className="flex items-center gap-1.5">
              {donor.is_available ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Eligible</span>
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">On cooldown</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <p className="font-heading font-bold text-base text-[#C0392B]">{donor.total_donations}</p>
            <p className="text-xs text-gray-400">Donations</p>
          </div>

          {donor.privacy_mode ? (
            <Button size="sm" variant="outline" className="text-xs">
              <Shield className="h-3.5 w-3.5" /> Request contact
            </Button>
          ) : (
            <a
              href={`tel:${donor.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm font-medium text-[#C0392B] hover:underline"
            >
              <Phone className="h-4 w-4" />
              <span className="text-xs">{donor.phone}</span>
            </a>
          )}
        </div>
      </Card>
    </Link>
  )
}
