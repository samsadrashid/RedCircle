import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format, addDays, startOfDay, endOfDay } from 'date-fns'

// Secure with CRON_SECRET env var. Set Authorization: Bearer <CRON_SECRET> in cron job headers.
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const now = new Date()

  // Day 85: donors whose cooldown ends in exactly 5 days
  const in5Days = addDays(now, 5)
  const { data: expiringSoon } = await supabase
    .from('donations')
    .select('donor_id, cooldown_ends_at')
    .gte('cooldown_ends_at', startOfDay(in5Days).toISOString())
    .lte('cooldown_ends_at', endOfDay(in5Days).toISOString())

  for (const d of expiringSoon || []) {
    const endsAt = format(new Date(d.cooldown_ends_at), 'dd MMM yyyy')
    await supabase.from('notifications').insert({
      user_id: d.donor_id,
      type: 'cooldown_expired',
      title: 'Rest period ending soon',
      body: `Your rest period ends in 5 days (${endsAt}). Get ready to save lives again! 🩸`,
      metadata: { cooldown_ends_at: d.cooldown_ends_at },
    })
  }

  // Day 90: cooldown ends today — restore availability and notify
  const { data: expiredToday } = await supabase
    .from('donations')
    .select('donor_id, cooldown_ends_at')
    .gte('cooldown_ends_at', startOfDay(now).toISOString())
    .lte('cooldown_ends_at', endOfDay(now).toISOString())

  for (const d of expiredToday || []) {
    await supabase.from('profiles').update({ is_available: true }).eq('id', d.donor_id)
    await supabase.from('notifications').insert({
      user_id: d.donor_id,
      type: 'cooldown_expired',
      title: "You're available to donate again!",
      body: 'Your rest period is over. Your profile is now visible to people in need. 🩸',
      metadata: {},
    })
  }

  return NextResponse.json({
    reminders_sent: expiringSoon?.length || 0,
    availability_restored: expiredToday?.length || 0,
  })
}
