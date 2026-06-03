import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { differenceInDays } from 'date-fns'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: latest } = await supabase
    .from('donations')
    .select('donated_at, cooldown_ends_at')
    .eq('donor_id', user.id)
    .order('donated_at', { ascending: false })
    .limit(1)
    .single()

  if (!latest) {
    return NextResponse.json({
      is_on_cooldown: false,
      last_donated_at: null,
      cooldown_ends_at: null,
      days_remaining: 0,
    })
  }

  const daysRemaining = Math.max(0, differenceInDays(new Date(latest.cooldown_ends_at), new Date()))

  return NextResponse.json({
    is_on_cooldown: daysRemaining > 0,
    last_donated_at: latest.donated_at,
    cooldown_ends_at: latest.cooldown_ends_at,
    days_remaining: daysRemaining,
  })
}
