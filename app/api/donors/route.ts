import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = createClient()

  let query = supabase
    .from('profiles')
    .select('id, full_name, blood_group, district, is_available, privacy_mode, donor_level, total_donations, profile_photo_url, nid_verified')
    .eq('nid_verified', true)
    .order('total_donations', { ascending: false })
    .limit(Number(searchParams.get('limit') || 50))

  const bloodGroup = searchParams.get('blood_group')
  const district = searchParams.get('district')
  const available = searchParams.get('available')

  if (bloodGroup) query = query.eq('blood_group', bloodGroup)
  if (district) query = query.eq('district', district)
  if (available === 'true') query = query.eq('is_available', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
