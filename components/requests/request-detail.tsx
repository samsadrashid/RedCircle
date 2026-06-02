'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Phone, Clock, CheckCircle, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BloodGroupBadge, UrgencyBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/input'
import { toast } from '@/components/ui/toaster'
import { createClient } from '@/lib/supabase/client'
import { formatDate, timeAgo } from '@/lib/utils'
import { BloodRequest, RequestMatch } from '@/types'

interface Props {
  request: BloodRequest & { requester: { full_name: string; profile_photo_url: string | null } }
  currentUserId?: string
  userMatch?: RequestMatch | null
}

export function RequestDetail({ request, currentUserId, userMatch }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [thankYouMsg, setThankYouMsg] = useState('')
  const [thankYouMatchId, setThankYouMatchId] = useState<string | null>(null)

  const isRequester = currentUserId === request.requester_id
  const isOpen = request.status === 'open'

  async function handleRespond() {
    if (!currentUserId) {
      router.push('/auth/login')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('request_matches').insert({
      request_id: request.id,
      donor_id: currentUserId,
    })
    if (error && error.code !== '23505') {
      toast({ type: 'error', title: 'Error', description: error.message })
    } else {
      toast({ type: 'success', title: 'Response sent!', description: 'The requester has been notified.' })
      router.refresh()
    }
    setLoading(false)
  }

  async function handleFulfill() {
    setLoading(true)
    const { error } = await supabase
      .from('blood_requests')
      .update({ status: 'fulfilled' })
      .eq('id', request.id)
    if (error) toast({ type: 'error', title: 'Error', description: error.message })
    else { toast({ type: 'success', title: 'Request marked as fulfilled!' }); router.refresh() }
    setLoading(false)
  }

  async function handleSendThankYou(matchId: string) {
    setLoading(true)
    const { error } = await supabase
      .from('request_matches')
      .update({ thank_you_message: thankYouMsg, status: 'completed' })
      .eq('id', matchId)
    if (error) toast({ type: 'error', title: 'Error', description: error.message })
    else { toast({ type: 'success', title: 'Thank you sent!', description: 'The donor has been thanked.' }); setThankYouMatchId(null); router.refresh() }
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status banner */}
      {request.status !== 'open' && (
        <div className={`rounded-2xl p-4 text-center font-medium ${request.status === 'fulfilled' ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {request.status === 'fulfilled' ? '✅ This request has been fulfilled' : '⏰ This request has expired'}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <BloodGroupBadge bloodGroup={request.blood_group_needed} size="lg" />
                <UrgencyBadge urgency={request.urgency} />
              </div>
              <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">
                {request.patient_name}
              </h1>
              <p className="text-gray-500 mt-1">{request.units_needed} unit{request.units_needed > 1 ? 's' : ''} of {request.blood_group_needed} needed</p>
            </div>
          </div>

          <div className="space-y-3 py-4 border-y border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{request.hospital_name}</p>
                <p className="text-gray-500">{request.location_text} · {request.district}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-5 w-5 text-gray-400 shrink-0" />
              <a href={`tel:${request.contact_phone}`} className="text-[#C0392B] font-medium hover:underline">
                {request.contact_phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Clock className="h-5 w-5 text-gray-400 shrink-0" />
              <span>Posted {timeAgo(request.created_at)} · Expires {formatDate(request.expires_at)}</span>
            </div>
          </div>

          {request.message && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{request.message}"</p>
            </div>
          )}

          {/* Actions */}
          {isOpen && !isRequester && (
            <div>
              {userMatch ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">You've responded to this request</p>
                    <p className="text-sm text-green-600 dark:text-green-500">Status: {userMatch.status}</p>
                  </div>
                </div>
              ) : (
                <Button size="lg" loading={loading} onClick={handleRespond} className="w-full">
                  <Heart className="h-5 w-5" /> I can donate
                </Button>
              )}
            </div>
          )}

          {isOpen && isRequester && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleFulfill} loading={loading} className="flex-1">
                <CheckCircle className="h-4 w-4" /> Mark as fulfilled
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requester info */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Posted by</h2>
          <div className="flex items-center gap-3">
            <Avatar src={request.requester?.profile_photo_url} fallback={request.requester?.full_name} size="md" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{request.requester?.full_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responses (requester view) */}
      {isRequester && request.matches && request.matches.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Donor Responses ({request.matches.length})
            </h2>
            <div className="space-y-3">
              {request.matches.map((match: RequestMatch & { donor: { full_name: string; phone: string; blood_group: string; profile_photo_url: string | null } }) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar src={match.donor?.profile_photo_url} fallback={match.donor?.full_name} size="sm" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{match.donor?.full_name}</p>
                      <a href={`tel:${match.donor?.phone}`} className="text-xs text-[#C0392B] hover:underline">{match.donor?.phone}</a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {match.thank_you_message ? (
                      <span className="text-xs text-green-500 font-medium">✓ Thanked</span>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => { setThankYouMatchId(match.id); setThankYouMsg('') }}>
                        Send thanks
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {thankYouMatchId && (
              <div className="mt-4 space-y-3">
                <Textarea
                  label="Thank you message"
                  placeholder="Thank the donor for their willingness to help..."
                  value={thankYouMsg}
                  onChange={(e) => setThankYouMsg(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setThankYouMatchId(null)} size="sm">Cancel</Button>
                  <Button size="sm" loading={loading} onClick={() => handleSendThankYou(thankYouMatchId)}>
                    Send thank you
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
