import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { addDays } from 'date-fns'

const createSchema = z.object({
  patient_name: z.string().min(1),
  blood_group_needed: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  units_needed: z.number().int().min(1).max(10),
  hospital_name: z.string().min(1),
  district: z.string().min(1),
  location_text: z.string().min(1),
  urgency: z.enum(['critical', 'urgent', 'normal']),
  contact_phone: z.string().min(1),
  message: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const supabase = createClient()

  let query = supabase
    .from('blood_requests')
    .select('*, requester:profiles!requester_id(full_name, district)')
    .eq('status', 'open')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(Number(searchParams.get('limit') || 50))

  const bloodGroup = searchParams.get('blood_group')
  const district = searchParams.get('district')
  const urgency = searchParams.get('urgency')

  if (bloodGroup) query = query.eq('blood_group_needed', bloodGroup)
  if (district) query = query.eq('district', district)
  if (urgency) query = query.eq('urgency', urgency)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error } = await supabase.from('blood_requests').insert({
    ...parsed.data,
    requester_id: user.id,
    expires_at: addDays(new Date(), 7).toISOString(),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify matching donors
  await notifyMatchingDonors(supabase, data)

  return NextResponse.json(data, { status: 201 })
}

async function notifyMatchingDonors(supabase: any, request: any) {
  if (request.urgency === 'normal') return

  const { data: donors } = await supabase
    .from('profiles')
    .select('id')
    .eq('blood_group', request.blood_group_needed)
    .eq('district', request.district)
    .eq('is_available', true)
    .eq('nid_verified', true)
    .limit(50)

  if (!donors || donors.length === 0) return

  const notifications = donors.map((d: { id: string }) => ({
    user_id: d.id,
    type: 'new_request_match',
    title: `🩸 ${request.urgency === 'critical' ? 'Critical' : 'Urgent'} blood request in ${request.district}`,
    body: `${request.blood_group_needed} blood needed for ${request.patient_name} at ${request.hospital_name}`,
    metadata: { request_id: request.id },
  }))

  await supabase.from('notifications').insert(notifications)
}
