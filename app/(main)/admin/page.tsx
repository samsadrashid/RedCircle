export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { AdminPanel } from '@/components/admin/admin-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Panel' }

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Check admin role (via metadata or separate admin table)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // For now check email domain or a specific admin email
  const isAdmin = profile?.email?.endsWith('@redcircle.app') || profile?.email === 'admin@example.com'
  if (!isAdmin) redirect('/')

  const [{ data: donors, count: donorCount }, { data: donations, count: donationCount }, { data: requests, count: requestCount }, { data: campaigns, count: campaignCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(20),
    supabase.from('donations').select('*', { count: 'exact', head: true }),
    supabase.from('blood_requests').select('*', { count: 'exact' }).eq('status', 'open').limit(10),
    supabase.from('campaigns').select('*', { count: 'exact' }).eq('status', 'active').limit(10),
  ])

  const stats = {
    total_donors: donorCount || 0,
    total_donations: donationCount || 0,
    active_requests: requestCount || 0,
    active_campaigns: campaignCount || 0,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-gray-500 mt-2">Manage the RedCircle platform</p>
      </div>

      <AdminPanel
        stats={stats}
        donors={donors || []}
        requests={requests || []}
        campaigns={campaigns || []}
      />
    </div>
  )
}
