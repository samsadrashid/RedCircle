'use client'

import Link from 'next/link'
import { MapPin, Clock, Phone, Building2, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { BloodGroupBadge, UrgencyBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BloodRequest } from '@/types'
import { timeAgo } from '@/lib/utils'

interface RequestCardProps {
  request: BloodRequest
  showActions?: boolean
  showStatus?: boolean
  currentUserId?: string
  responseCount?: number
}

const statusStyles: Record<string, string> = {
  open: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  fulfilled: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  expired: 'bg-gray-100 dark:bg-gray-800 text-gray-500',
}

const statusLabels: Record<string, string> = {
  open: '● Open',
  fulfilled: '✓ Fulfilled',
  expired: '⏰ Expired',
}

export function RequestCard({ request, showActions = true, showStatus = false, currentUserId, responseCount }: RequestCardProps) {
  const expiresAt = new Date(request.expires_at)
  const isExpiringSoon = request.status === 'open' && expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000
  const isOwner = currentUserId === request.requester_id

  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-200">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <BloodGroupBadge bloodGroup={request.blood_group_needed} />
          <UrgencyBadge urgency={request.urgency} />
        </div>
        {showStatus && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusStyles[request.status] ?? statusStyles.expired}`}>
            {statusLabels[request.status] ?? request.status}
          </span>
        )}
      </div>

      {/* Patient & units */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white leading-snug">{request.patient_name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {request.units_needed} unit{request.units_needed > 1 ? 's' : ''} of <span className="font-medium text-gray-700 dark:text-gray-300">{request.blood_group_needed}</span> needed
        </p>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{request.hospital_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <span>{request.district}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-gray-400" />
          <span className={isExpiringSoon ? 'text-orange-500 font-medium' : ''}>
            {isExpiringSoon ? '⚠ Expires soon · ' : ''}{timeAgo(request.created_at)}
          </span>
        </div>
        {showStatus && responseCount !== undefined && responseCount > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-gray-400" />
            <span>{responseCount} donor{responseCount > 1 ? 's' : ''} responded</span>
          </div>
        )}
      </div>

      {request.message && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-700 pl-3 line-clamp-2">
          {request.message}
        </p>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
          <Button size="sm" asChild className="flex-1">
            <Link href={`/requests/${request.id}`}>
              {isOwner ? 'Manage' : 'View & Respond'}
            </Link>
          </Button>
          {!isOwner && (
            <a href={`tel:${request.contact_phone}`}>
              <Button size="sm" variant="secondary">
                <Phone className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      )}
    </Card>
  )
}
