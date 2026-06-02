import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DonorProfile } from '@/components/profile/donor-profile'
import type { Metadata } from 'next'

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('profiles').select('full_name, blood_group').eq('id', params.id).single()
  if (!data) return { title: 'Donor Not Found' }
  return { title: `${data.full_name} — ${data.blood_group} Donor` }
}

export default async function DonorPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!profile) notFound()

  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('donor_id', params.id)
    .order('donated_at', { ascending: false })

  const { data: badges } = await supabase
    .from('donor_badges')
    .select('*')
    .eq('donor_id', params.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <DonorProfile
          profile={profile as any}
          donations={donations || []}
          badges={badges || []}
          isOwnProfile={user?.id === params.id}
        />
      </div>
    </div>
  )
}
