'use client'

import Link from 'next/link'
import { MapPin, Calendar, Users, Share2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { BloodGroupBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campaign } from '@/types'
import { formatDate, generateWhatsAppText } from '@/lib/utils'

interface CampaignCardProps {
  campaign: Campaign & {
    organizer?: { full_name: string; profile_photo_url: string | null }
    volunteer_count?: { count: number }[]
  }
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const volunteerCount = campaign.volunteer_count?.[0]?.count || 0
  const spotsLeft = campaign.volunteers_needed - volunteerCount
  const whatsappText = generateWhatsAppText(campaign)

  return (
    <Card className="flex flex-col hover:shadow-md transition-all duration-200">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-heading font-semibold text-gray-900 dark:text-white line-clamp-2">
            {campaign.title}
          </h3>
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors shrink-0"
          >
            <Share2 className="h-4 w-4" />
          </a>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {campaign.blood_groups_needed.map((bg) => (
            <BloodGroupBadge key={bg} bloodGroup={bg} size="sm" />
          ))}
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="truncate">{campaign.venue_name}, {campaign.district}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <span>{formatDate(campaign.event_date)} at {campaign.event_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400 shrink-0" />
            <span>
              <span className={spotsLeft < 5 ? 'text-orange-500 font-medium' : ''}>
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
              </span>
              {' '}· {volunteerCount}/{campaign.volunteers_needed} volunteers
            </span>
          </div>
        </div>

        {campaign.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">{campaign.description}</p>
        )}
      </div>

      <div className="px-5 pb-5">
        <Button asChild className="w-full">
          <Link href={`/campaigns/${campaign.id}`}>View & Join</Link>
        </Button>
      </div>
    </Card>
  )
}
