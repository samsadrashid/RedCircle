export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { BloodGroupBadge, DonorLevelBadge } from '@/components/ui/badge'
import { LIVES_PER_DONATION } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Leaderboard' }

export default async function LeaderboardPage() {
  const supabase = createClient()

  const [{ data: topDonors }, { data: stats }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, blood_group, district, total_donations, donor_level, profile_photo_url')
      .eq('nid_verified', true)
      .gt('total_donations', 0)
      .order('total_donations', { ascending: false })
      .limit(50),
    supabase.from('donations').select('*', { count: 'exact', head: true }),
  ])

  const totalDonations = stats?.length || 0
  const livesImpacted = (totalDonations) * LIVES_PER_DONATION

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Community Leaderboard</h1>
        <p className="text-gray-500 mt-2">Our top blood donors making a difference across Bangladesh</p>
      </div>

      {/* Lives counter */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Donors', value: topDonors?.length || 0, icon: '👤' },
          { label: 'Total Donations', value: totalDonations, icon: '🩸' },
          { label: 'Lives Impacted', value: livesImpacted, icon: '❤️' },
        ].map(stat => (
          <Card key={stat.label} className="text-center p-5">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="font-heading font-bold text-3xl text-[#C0392B]">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Top 3 podium */}
      {topDonors && topDonors.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-10">
          {[topDonors[1], topDonors[0], topDonors[2]].map((donor, i) => {
            const position = [2, 1, 3][i]
            const heights = ['h-24', 'h-32', 'h-20']
            return (
              <Link key={donor.id} href={`/donor/${donor.id}`} className="flex flex-col items-center gap-3">
                <Avatar src={donor.profile_photo_url} fallback={donor.full_name} size="lg" />
                <div className="text-center">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{donor.full_name.split(' ')[0]}</p>
                  <BloodGroupBadge bloodGroup={donor.blood_group} size="sm" />
                </div>
                <div className={`${heights[i]} w-20 rounded-t-xl flex items-center justify-center font-heading font-bold text-white ${position === 1 ? 'bg-[#C0392B]' : position === 2 ? 'bg-gray-400' : 'bg-amber-600'}`}>
                  <div className="text-center">
                    <div className="text-2xl">{['🥈', '🥇', '🥉'][i]}</div>
                    <div className="text-sm">{donor.total_donations}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <Card>
        <CardContent className="p-0">
          {topDonors?.map((donor, index) => (
            <Link key={donor.id} href={`/donor/${donor.id}`}>
              <div className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${index < topDonors.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                <span className={`text-lg font-heading font-bold w-8 text-center ${index < 3 ? 'text-[#C0392B]' : 'text-gray-400'}`}>
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                </span>
                <Avatar src={donor.profile_photo_url} fallback={donor.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{donor.full_name}</p>
                  <p className="text-xs text-gray-500">{donor.district}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BloodGroupBadge bloodGroup={donor.blood_group} size="sm" />
                  <DonorLevelBadge level={donor.donor_level} />
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-[#C0392B]">{donor.total_donations}</p>
                  <p className="text-xs text-gray-400">donations</p>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
