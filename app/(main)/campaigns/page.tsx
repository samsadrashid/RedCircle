export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CampaignCard } from '@/components/campaigns/campaign-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Plus, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Campaigns' }

export default async function CampaignsPage() {
  const supabase = createClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, organizer:profiles!organizer_id(full_name, profile_photo_url), volunteer_count:campaign_volunteers(count)')
    .eq('status', 'active')
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true })
    .limit(50)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Blood Campaigns</h1>
          <p className="text-gray-500 mt-2">{campaigns?.length || 0} upcoming blood drives</p>
        </div>
        <Button asChild className="self-start sm:self-auto shrink-0">
          <Link href="/campaigns/new"><Plus className="h-4 w-4" /> Create Campaign</Link>
        </Button>
      </div>

      {!campaigns || campaigns.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No upcoming campaigns"
          description="Be the first to organize a blood donation drive in your area."
          action={{ label: 'Create a campaign', href: '/campaigns/new' }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign as any} />
          ))}
        </div>
      )}
    </div>
  )
}
