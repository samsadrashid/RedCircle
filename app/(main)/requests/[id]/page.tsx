import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { RequestDetail } from '@/components/requests/request-detail'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('blood_requests').select('patient_name, blood_group_needed').eq('id', params.id).single()
  if (!data) return { title: 'Request Not Found' }
  return { title: `Blood Request — ${data.blood_group_needed} for ${data.patient_name}` }
}

export default async function RequestPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: request } = await supabase
    .from('blood_requests')
    .select('*, requester:profiles!requester_id(*), matches:request_matches(*, donor:profiles!donor_id(*))')
    .eq('id', params.id)
    .single()

  if (!request) notFound()

  const userMatch = user
    ? request.matches?.find((m: { donor_id: string }) => m.donor_id === user.id)
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <RequestDetail request={request} currentUserId={user?.id} userMatch={userMatch} />
      </div>
    </div>
  )
}
