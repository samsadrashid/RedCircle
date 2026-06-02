import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LIVES_PER_DONATION } from '@/lib/constants'

export async function GET() {
  const supabase = createClient()

  const [donors, donations, requests, campaigns] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('nid_verified', true),
    supabase.from('donations').select('*', { count: 'exact', head: true }),
    supabase.from('blood_requests').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  return NextResponse.json({
    total_donors: donors.count || 0,
    total_donations: donations.count || 0,
    active_requests: requests.count || 0,
    active_campaigns: campaigns.count || 0,
    lives_impacted: (donations.count || 0) * LIVES_PER_DONATION,
  })
}
