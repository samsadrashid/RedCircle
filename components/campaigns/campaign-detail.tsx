'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Clock, Users, Share2, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BloodGroupBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { toast } from '@/components/ui/toaster'
import { createClient } from '@/lib/supabase/client'
import { Campaign, CampaignVolunteer } from '@/types'
import { formatDate, generateWhatsAppText } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface Props {
  campaign: Campaign & {
    organizer: { full_name: string; profile_photo_url: string | null }
    volunteers: (CampaignVolunteer & { donor: { full_name: string; blood_group: string; profile_photo_url: string | null } })[]
  }
  currentUserId?: string
  userVolunteer?: CampaignVolunteer | null
}

export function CampaignDetail({ campaign, currentUserId, userVolunteer }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const volunteerCount = campaign.volunteers?.length || 0
  const fillPct = Math.min(100, Math.round((volunteerCount / campaign.volunteers_needed) * 100))
  const isOrganizer = currentUserId === campaign.organizer_id
  const whatsappText = generateWhatsAppText(campaign)

  async function handleJoin() {
    if (!currentUserId) { router.push('/auth/login'); return }
    setLoading(true)
    const { error } = await supabase.from('campaign_volunteers').insert({
      campaign_id: campaign.id,
      donor_id: currentUserId,
    })
    if (error && error.code !== '23505') toast({ type: 'error', title: 'Error', description: error.message })
    else { toast({ type: 'success', title: 'Joined!', description: 'You\'ve joined this campaign.' }); router.refresh() }
    setLoading(false)
  }

  async function handleMarkStatus(status: 'fulfilled' | 'cancelled') {
    setLoading(true)
    const { error } = await supabase.from('campaigns').update({ status }).eq('id', campaign.id)
    if (error) toast({ type: 'error', title: 'Error', description: error.message })
    else { toast({ type: 'success', title: `Campaign ${status}!` }); router.refresh() }
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {campaign.status !== 'active' && (
        <div className={`rounded-2xl p-4 text-center font-medium ${campaign.status === 'fulfilled' ? 'bg-green-50 dark:bg-green-950/30 text-green-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {campaign.status === 'fulfilled' ? '✅ Campaign completed successfully' : '❌ Campaign cancelled'}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">{campaign.title}</h1>
              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-500 mt-2 leading-relaxed">{campaign.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {campaign.blood_groups_needed.map(bg => (
              <BloodGroupBadge key={bg} bloodGroup={bg} size="md" />
            ))}
          </div>

          <div className="space-y-3 py-4 border-y border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{campaign.venue_name}</p>
                <p className="text-gray-500">{campaign.venue_address} · {campaign.district}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
              <span className="text-gray-900 dark:text-white font-medium">{formatDate(campaign.event_date)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 text-gray-400 shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">{campaign.event_time}</span>
            </div>
          </div>

          {/* Volunteer progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{volunteerCount}/{campaign.volunteers_needed} volunteers</span>
              </div>
              <span className="text-sm font-medium text-[#C0392B]">{fillPct}% full</span>
            </div>
            <Progress value={fillPct} />
          </div>

          {/* Actions */}
          {campaign.status === 'active' && (
            <div className="space-y-3">
              {userVolunteer ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="font-medium text-green-700 dark:text-green-400">You've joined this campaign</p>
                </div>
              ) : (
                <Button size="lg" loading={loading} onClick={handleJoin} className="w-full" disabled={volunteerCount >= campaign.volunteers_needed}>
                  <Users className="h-5 w-5" />
                  {volunteerCount >= campaign.volunteers_needed ? 'Campaign full' : 'Join as Volunteer'}
                </Button>
              )}

              {isOrganizer && (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleMarkStatus('fulfilled')} loading={loading} className="flex-1">
                    Mark Fulfilled
                  </Button>
                  <Button variant="danger" onClick={() => handleMarkStatus('cancelled')} loading={loading} className="flex-1">
                    Cancel Campaign
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organizer */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Organized by</h2>
          <div className="flex items-center gap-3">
            <Avatar src={campaign.organizer.profile_photo_url} fallback={campaign.organizer.full_name} />
            <p className="font-medium text-gray-900 dark:text-white">{campaign.organizer.full_name}</p>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer list */}
      {campaign.volunteers && campaign.volunteers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Volunteers ({volunteerCount})
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {campaign.volunteers.slice(0, 10).map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Avatar src={v.donor?.profile_photo_url} fallback={v.donor?.full_name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{v.donor?.full_name}</p>
                    <BloodGroupBadge bloodGroup={v.donor?.blood_group as any} size="sm" />
                  </div>
                </div>
              ))}
              {volunteerCount > 10 && (
                <p className="text-sm text-gray-400 col-span-2">+{volunteerCount - 10} more volunteers</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
