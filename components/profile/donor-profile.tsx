'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, CheckCircle, Clock, Edit, Share2, QrCode, Droplets } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { BloodGroupBadge, DonorLevelBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Modal } from '@/components/ui/modal'
import { Profile, Donation, DonorBadge } from '@/types'
import { formatDate, getCooldownDaysRemaining, getCooldownProgress } from '@/lib/utils'
import { BADGE_CONFIG, LIVES_PER_DONATION as LPD } from '@/lib/constants'
import dynamic from 'next/dynamic'
import { CooldownBadge } from '@/components/donations/CooldownBadge'
import { DonationHistory } from '@/components/donations/DonationHistory'
import { LogDonationSheet } from '@/components/donations/LogDonationSheet'

const QRCodeComponent = dynamic(() => import('react-qr-code').then(m => ({ default: m.default })), { ssr: false })

interface Props {
  profile: Profile
  donations: Donation[]
  badges: DonorBadge[]
  isOwnProfile: boolean
}

export function DonorProfile({ profile, donations, badges, isOwnProfile }: Props) {
  const [showQR, setShowQR] = useState(false)
  const [showDonateSheet, setShowDonateSheet] = useState(false)
  const latestDonation = donations[0]
  const cooldownRemaining = latestDonation ? getCooldownDaysRemaining(latestDonation.cooldown_ends_at) : 0
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://redcircle.app'}/donor/${profile.id}`

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar src={profile.profile_photo_url} fallback={profile.full_name} size="xl" />
                {profile.nid_verified && (
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">{profile.full_name}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <BloodGroupBadge bloodGroup={profile.blood_group} />
                  <DonorLevelBadge level={profile.donor_level} />
                </div>
                {profile.district && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />{profile.district}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <Button variant="ghost" size="icon" onClick={() => setShowQR(true)}>
                <QrCode className="h-5 w-5" />
              </Button>
              {isOwnProfile && (
                <>
                  <Button size="sm" onClick={() => setShowDonateSheet(true)}>
                    <Droplets className="h-4 w-4" /> Log Donation
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/profile/edit"><Edit className="h-4 w-4" /> Edit</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-[#C0392B]">{profile.total_donations}</p>
              <p className="text-xs text-gray-500">Donations</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-[#C0392B]">{profile.total_donations * LPD}</p>
              <p className="text-xs text-gray-500">Lives helped</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {profile.is_available ? (
                  <>
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="font-semibold text-green-600 dark:text-green-400 text-sm">Eligible</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-amber-600 dark:text-amber-400 text-sm">{cooldownRemaining}d</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Status</p>
            </div>
          </div>

          {/* Cooldown progress */}
          {!profile.is_available && latestDonation && (
            <div className="mt-4">
              <Progress
                value={getCooldownProgress(latestDonation.donated_at)}
                label={`Cooldown: ${cooldownRemaining} days remaining until eligible`}
                indicatorClassName={cooldownRemaining < 14 ? 'bg-green-500' : 'bg-amber-500'}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      {badges.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Badges Earned</h2>
            <div className="flex flex-wrap gap-3">
              {badges.map(badge => {
                const config = BADGE_CONFIG[badge.badge_type as keyof typeof BADGE_CONFIG]
                return (
                  <div key={badge.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-xl">{config.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{config.label}</p>
                      <p className="text-xs text-gray-500">{formatDate(badge.awarded_at)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cooldown status — own profile only */}
      {isOwnProfile && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Donation Status</h2>
            <CooldownBadge
              isAvailable={profile.is_available}
              cooldownEndsAt={latestDonation?.cooldown_ends_at}
              donatedAt={latestDonation?.donated_at}
            />
            {profile.is_available && (
              <Button size="sm" className="mt-4 w-full" onClick={() => setShowDonateSheet(true)}>
                <Droplets className="h-4 w-4" /> Log a Donation
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Donation history */}
      {isOwnProfile ? (
        <DonationHistory donations={donations} isOwnProfile />
      ) : donations.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Donation History</h2>
            <div className="space-y-3">
              {donations.map((donation, i) => (
                <div key={donation.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className="h-8 w-8 rounded-full bg-[#C0392B]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm">🩸</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{donation.hospital_name}</p>
                    <p className="text-xs text-gray-500">{donation.district} · {formatDate(donation.donated_at)}</p>
                    {donation.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{donation.notes}</p>}
                  </div>
                  <span className="text-xs text-gray-400">#{profile.total_donations - i}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Log donation sheet */}
      {isOwnProfile && (
        <LogDonationSheet
          open={showDonateSheet}
          onClose={() => setShowDonateSheet(false)}
        />
      )}

      {/* QR Code Modal */}
      <Modal open={showQR} onClose={() => setShowQR(false)} title="Donor Profile QR Code">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-xl">
            <QRCodeComponent value={profileUrl} size={200} />
          </div>
          <p className="text-sm text-gray-500 text-center">Scan to view {profile.full_name}'s donor profile</p>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(profileUrl)}
            className="w-full"
          >
            <Share2 className="h-4 w-4" /> Copy profile link
          </Button>
        </div>
      </Modal>
    </div>
  )
}
