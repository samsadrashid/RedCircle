import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = createClient()
  const district = searchParams.get('district')
  const limit = Number(searchParams.get('limit') || 50)

  let query = supabase
    .from('profiles')
    .select('id, full_name, blood_group, district, total_donations, donor_level, profile_photo_url')
    .eq('nid_verified', true)
    .gt('total_donations', 0)
    .order('total_donations', { ascending: false })
    .limit(limit)

  if (district) query = query.eq('district', district)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
