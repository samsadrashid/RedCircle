import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CampaignDetail } from '@/components/campaigns/campaign-detail'
import type { Metadata } from 'next'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('campaigns').select('title').eq('id', params.id).single()
  return { title: data?.title || 'Campaign' }
}

export default async function CampaignPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*, organizer:profiles!organizer_id(*), volunteers:campaign_volunteers(*, donor:profiles!donor_id(full_name, blood_group, profile_photo_url))')
    .eq('id', params.id)
    .single()

  if (!campaign) notFound()

  const userVolunteer = user ? campaign.volunteers?.find((v: { donor_id: string }) => v.donor_id === user.id) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <CampaignDetail campaign={campaign as any} currentUserId={user?.id} userVolunteer={userVolunteer} />
      </div>
    </div>
  )
}
