'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Droplets, Heart, Calendar, CheckCircle, XCircle, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { BloodGroupBadge, UrgencyBadge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { createClient } from '@/lib/supabase/client'
import { Profile, BloodRequest, Campaign } from '@/types'
import { formatDate, timeAgo } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'

interface Props {
  stats: { total_donors: number; total_donations: number; active_requests: number; active_campaigns: number }
  donors: Profile[]
  requests: BloodRequest[]
  campaigns: Campaign[]
}

export function AdminPanel({ stats, donors: initialDonors, requests, campaigns }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [donors, setDonors] = useState(initialDonors)

  async function verifyDonor(id: string) {
    const { error } = await supabase.from('profiles').update({ nid_verified: true }).eq('id', id)
    if (error) toast({ type: 'error', title: 'Error', description: error.message })
    else {
      setDonors(prev => prev.map(d => d.id === id ? { ...d, nid_verified: true } : d))
      toast({ type: 'success', title: 'Donor verified!' })
    }
  }

  async function flagDonor(id: string) {
    const { error } = await supabase.from('profiles').update({ nid_verified: false }).eq('id', id)
    if (error) toast({ type: 'error', title: 'Error', description: error.message })
    else {
      setDonors(prev => prev.map(d => d.id === id ? { ...d, nid_verified: false } : d))
      toast({ type: 'info', title: 'Donor flagged' })
    }
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Donors', value: stats.total_donors, icon: Users, color: 'text-blue-600' },
          { label: 'Total Donations', value: stats.total_donations, icon: Droplets, color: 'text-[#C0392B]' },
          { label: 'Active Requests', value: stats.active_requests, icon: Heart, color: 'text-orange-500' },
          { label: 'Active Campaigns', value: stats.active_campaigns, icon: Calendar, color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="font-heading font-bold text-xl text-gray-900 dark:text-white">{value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="donors">
        <Tabs.List className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
          {['donors', 'requests', 'campaigns'].map(tab => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all text-gray-500 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="donors">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Donor</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Blood</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">District</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Donations</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map(donor => (
                      <tr key={donor.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={donor.profile_photo_url} fallback={donor.full_name} size="sm" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{donor.full_name}</p>
                              <p className="text-xs text-gray-400">{donor.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><BloodGroupBadge bloodGroup={donor.blood_group} size="sm" /></td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{donor.district || '-'}</td>
                        <td className="p-4 font-semibold text-[#C0392B]">{donor.total_donations}</td>
                        <td className="p-4">
                          {donor.nid_verified ? (
                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                              <CheckCircle className="h-4 w-4" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                              <Shield className="h-4 w-4" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {!donor.nid_verified ? (
                              <Button size="sm" onClick={() => verifyDonor(donor.id)}>Verify</Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => flagDonor(donor.id)} className="text-red-500">Flag</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="requests">
          <div className="space-y-3">
            {requests.map(req => (
              <Card key={req.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BloodGroupBadge bloodGroup={req.blood_group_needed} size="sm" />
                      <UrgencyBadge urgency={req.urgency} />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">{req.patient_name} — {req.hospital_name}</p>
                    <p className="text-sm text-gray-500">{req.district} · {timeAgo(req.created_at)}</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/requests/${req.id}`}>View</a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="campaigns">
          <div className="space-y-3">
            {campaigns.map(campaign => (
              <Card key={campaign.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{campaign.title}</p>
                    <p className="text-sm text-gray-500">{campaign.district} · {formatDate(campaign.event_date)}</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/campaigns/${campaign.id}`}>View</a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
