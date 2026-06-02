export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Droplets, Bell, Heart, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { BloodGroupBadge, DonorLevelBadge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDate, getCooldownDaysRemaining, getCooldownProgress } from '@/lib/utils'
import { LIVES_PER_DONATION } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: donations }, { data: notifications }, { data: badges }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('donations').select('*').eq('donor_id', user.id).order('donated_at', { ascending: false }).limit(5),
    supabase.from('notifications').select('*').eq('user_id', user.id).eq('is_read', false).limit(5),
    supabase.from('donor_badges').select('*').eq('donor_id', user.id),
  ])

  if (!profile) redirect('/auth/signup')

  const latestDonation = donations?.[0]
  const cooldownRemaining = latestDonation ? getCooldownDaysRemaining(latestDonation.cooldown_ends_at) : 0
  const cooldownPct = latestDonation ? getCooldownProgress(latestDonation.donated_at) : 100

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar src={profile.profile_photo_url} fallback={profile.full_name} size="lg" />
          <div>
            <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">
              Welcome, {profile.full_name.split(' ')[0]}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <BloodGroupBadge bloodGroup={profile.blood_group} size="sm" />
              <DonorLevelBadge level={profile.donor_level} />
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/donate"><Droplets className="h-4 w-4" /> Log Donation</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats row */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Donations', value: profile.total_donations, icon: '🩸' },
              { label: 'Lives Impacted', value: profile.total_donations * LIVES_PER_DONATION, icon: '❤️' },
              { label: 'Badges Earned', value: badges?.length || 0, icon: '🏅' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-5 pb-5 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <p className="font-heading font-bold text-2xl text-[#C0392B]">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Availability status */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Donation Status</h2>
              {profile.is_available ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                  <span className="h-4 w-4 rounded-full bg-green-400 animate-pulse" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">You're eligible to donate!</p>
                    <p className="text-sm text-green-600 dark:text-green-500">Find a blood drive or check current requests.</p>
                  </div>
                </div>
              ) : latestDonation ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last donated: {formatDate(latestDonation.donated_at)}</p>
                    <p className="text-sm font-medium text-amber-600">{cooldownRemaining} days remaining</p>
                  </div>
                  <Progress value={cooldownPct} label="Cooldown progress" indicatorClassName={cooldownRemaining < 14 ? 'bg-green-500' : 'bg-amber-500'} />
                  <p className="text-xs text-gray-400 mt-2">Eligible again on {formatDate(latestDonation.cooldown_ends_at)}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Recent donations */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Donation History</h2>
                <Link href={`/donor/${user.id}`} className="text-sm text-[#C0392B] hover:underline">View all</Link>
              </div>
              {donations && donations.length > 0 ? (
                <div className="space-y-3">
                  {donations.map((d, i) => (
                    <div key={d.id} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#C0392B]/10 flex items-center justify-center shrink-0">
                        <span className="text-sm">🩸</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{d.hospital_name}</p>
                        <p className="text-xs text-gray-500">{d.district} · {formatDate(d.donated_at)}</p>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">#{profile.total_donations - i}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No donations logged yet</p>
                  <Button asChild>
                    <Link href="/dashboard/donate">Log your first donation</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick links */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { href: '/dashboard/donate', icon: Droplets, label: 'Log a donation' },
                  { href: '/requests/new', icon: Heart, label: 'Post blood request' },
                  { href: '/campaigns/new', icon: Calendar, label: 'Create campaign' },
                  { href: `/donor/${user.id}`, icon: TrendingUp, label: 'View my profile' },
                  { href: '/dashboard/notifications', icon: Bell, label: `Notifications${notifications?.length ? ` (${notifications.length})` : ''}` },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-gray-400 group-hover:text-[#C0392B]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          {badges && badges.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your Badges</h2>
                <div className="space-y-2">
                  {badges.map(badge => (
                    <div key={badge.id} className="flex items-center gap-2 text-sm">
                      <span>
                        {badge.badge_type === 'first_drop' ? '🩸' :
                         badge.badge_type === 'bronze_heart' ? '🥉' :
                         badge.badge_type === 'silver_vein' ? '🥈' :
                         badge.badge_type === 'gold_pulse' ? '🥇' : '🏆'}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {badge.badge_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent notifications */}
          {notifications && notifications.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
                  <Link href="/dashboard/notifications" className="text-xs text-[#C0392B] hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map(n => (
                    <div key={n.id} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
