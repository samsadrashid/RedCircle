export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, Droplets, Calendar, Building2, ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BloodGroupBadge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { LIVES_PER_DONATION } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { Campaign, BloodRequest, Profile } from '@/types'

async function getStats() {
  const supabase = createClient()
  const [donors, donations, requests, campaigns] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('nid_verified', true),
    supabase.from('donations').select('*', { count: 'exact', head: true }),
    supabase.from('blood_requests').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])
  return {
    total_donors: donors.count || 0,
    total_donations: donations.count || 0,
    active_requests: requests.count || 0,
    active_campaigns: campaigns.count || 0,
    lives_impacted: (donations.count || 0) * LIVES_PER_DONATION,
  }
}

async function getRecentCampaigns() {
  const supabase = createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'active')
    .order('event_date', { ascending: true })
    .limit(3)
  return (data || []) as Campaign[]
}

async function getUrgentRequests() {
  const supabase = createClient()
  const { data } = await supabase
    .from('blood_requests')
    .select('*, requester:profiles!requester_id(full_name, district)')
    .eq('status', 'open')
    .eq('urgency', 'critical')
    .order('created_at', { ascending: false })
    .limit(3)
  return (data || []) as BloodRequest[]
}

async function getFeaturedDonor() {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('nid_verified', true)
    .order('total_donations', { ascending: false })
    .limit(1)
    .single()
  return data as Profile | null
}

const QUICK_ACTIONS = [
  { href: '/donors', icon: Search, label: 'Find Donors', description: 'Search by blood group & district', color: 'bg-red-50 dark:bg-red-950/30 text-[#C0392B]' },
  { href: '/dashboard/donate', icon: Droplets, label: 'Log Donation', description: 'Record your blood donation', color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' },
  { href: '/campaigns/new', icon: Calendar, label: 'Create Campaign', description: 'Organize a blood drive', color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
  { href: '/hospitals', icon: Building2, label: 'Hospitals', description: 'Find blood banks near you', color: 'bg-green-50 dark:bg-green-950/30 text-green-600' },
]

export default async function HomePage() {
  const [stats, campaigns, urgentRequests, featuredDonor] = await Promise.all([
    getStats(),
    getRecentCampaigns(),
    getUrgentRequests(),
    getFeaturedDonor(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C0392B] via-[#96281B] to-[#7B241C] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              {stats.active_requests} active blood requests right now
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              One donation can save
              <br />
              <span className="text-red-200">up to 3 lives</span>
            </h1>
            <p className="text-lg sm:text-xl text-red-100 mb-8 max-w-2xl leading-relaxed">
              RedCircle connects blood donors with patients in need across Bangladesh.
              Find donors, post requests, and organize campaigns — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-white text-[#C0392B] hover:bg-red-50" asChild>
                <Link href="/donors">Find Donors <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/auth/signup">Become a Donor</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Live stats bar */}
        <div className="relative border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'Verified Donors', value: stats.total_donors.toLocaleString() },
                { label: 'Total Donations', value: stats.total_donations.toLocaleString() },
                { label: 'Lives Impacted', value: stats.lives_impacted.toLocaleString() },
                { label: 'Active Requests', value: stats.active_requests.toLocaleString() },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading font-bold text-2xl sm:text-3xl">{stat.value}</p>
                  <p className="text-red-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="section-title mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="p-5 h-full">
                <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white">{action.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Urgent Requests */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">🚨 Critical Requests</h2>
              <Link href="/requests" className="text-sm text-[#C0392B] font-medium hover:underline">View all</Link>
            </div>
            {urgentRequests.length > 0 ? (
              <div className="space-y-4">
                {urgentRequests.map((request) => (
                  <Link key={request.id} href={`/requests/${request.id}`}>
                    <Card hover className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BloodGroupBadge bloodGroup={request.blood_group_needed} size="sm" />
                            <span className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full">🚨 Critical</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {request.patient_name} — {request.units_needed} unit{request.units_needed > 1 ? 's' : ''}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {request.hospital_name} · {request.district}
                          </p>
                        </div>
                        <Button size="sm" asChild>
                          <span>Respond</span>
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-400">No critical requests right now 🎉</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured donor */}
            {featuredDonor && (
              <div>
                <h2 className="section-title mb-4">⭐ Top Donor</h2>
                <Link href={`/donor/${featuredDonor.id}`}>
                  <Card hover className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar src={featuredDonor.profile_photo_url} fallback={featuredDonor.full_name} size="lg" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{featuredDonor.full_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <BloodGroupBadge bloodGroup={featuredDonor.blood_group} size="sm" />
                          <span className="text-xs text-gray-500">{featuredDonor.district}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-center pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="font-heading font-bold text-xl text-[#C0392B]">{featuredDonor.total_donations}</p>
                        <p className="text-xs text-gray-500">Donations</p>
                      </div>
                      <div>
                        <p className="font-heading font-bold text-xl text-[#C0392B]">{featuredDonor.total_donations * LIVES_PER_DONATION}</p>
                        <p className="text-xs text-gray-500">Lives saved</p>
                      </div>
                      <div>
                        <p className="font-heading font-bold text-xl text-green-500">🏆</p>
                        <p className="text-xs text-gray-500">Hero status</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            )}

            {/* Upcoming campaigns */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">📅 Upcoming Campaigns</h2>
                <Link href="/campaigns" className="text-sm text-[#C0392B] font-medium hover:underline">All</Link>
              </div>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                    <Card hover className="p-4">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{campaign.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">📍 {campaign.venue_name}</p>
                      <p className="text-xs text-[#C0392B] font-medium mt-1">📅 {formatDate(campaign.event_date)}</p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {campaign.blood_groups_needed.slice(0, 4).map(bg => (
                          <BloodGroupBadge key={bg} bloodGroup={bg} size="sm" />
                        ))}
                        {campaign.blood_groups_needed.length > 4 && (
                          <span className="text-xs text-gray-400">+{campaign.blood_groups_needed.length - 4}</span>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-[#C0392B]/10 flex items-center justify-center">
              <Heart className="h-8 w-8 text-[#C0392B] fill-[#C0392B]" />
            </div>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            Ready to save a life?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto mb-8">
            It only takes 30 minutes. Your blood can save up to 3 lives. Join thousands of donors across Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Register as Donor <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/education">Learn about donation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
