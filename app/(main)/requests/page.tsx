export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RequestBoard } from '@/components/requests/request-board'
import { Plus, Droplets, AlertTriangle, Zap, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blood Requests' }

interface PageProps {
  searchParams: { blood_group?: string; district?: string; urgency?: string; tab?: string }
}

async function getData(searchParams: PageProps['searchParams']) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('blood_requests')
    .select('*, requester:profiles!requester_id(full_name, phone, district, blood_group)')
    .eq('status', 'open')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(100)

  if (searchParams.blood_group) query = query.eq('blood_group_needed', searchParams.blood_group)
  if (searchParams.district) query = query.eq('district', searchParams.district)
  if (searchParams.urgency) query = query.eq('urgency', searchParams.urgency)

  const { data: requests } = await query

  let myRequests = null
  if (user) {
    const { data } = await supabase
      .from('blood_requests')
      .select('*, requester:profiles!requester_id(full_name, phone, district, blood_group), matches:request_matches(id, status)')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false })
    myRequests = data
  }

  return { requests: requests || [], myRequests, userId: user?.id }
}

export default async function RequestsPage({ searchParams }: PageProps) {
  const { requests, myRequests, userId } = await getData(searchParams)

  const urgencyOrder = { critical: 0, urgent: 1, normal: 2 }
  const sorted = [...requests].sort((a, b) =>
    (urgencyOrder[a.urgency as keyof typeof urgencyOrder] ?? 2) - (urgencyOrder[b.urgency as keyof typeof urgencyOrder] ?? 2)
  )

  const stats = {
    total: requests.length,
    critical: requests.filter(r => r.urgency === 'critical').length,
    urgent: requests.filter(r => r.urgency === 'urgent').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Blood Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Donors needed across Bangladesh</p>
        </div>
        <Button asChild className="self-start sm:self-auto shrink-0">
          <Link href="/requests/new">
            <Plus className="h-4 w-4" /> Post Request
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
            <Droplets className="h-5 w-5 text-[#C0392B]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-500">Active requests</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.critical}</p>
            <p className="text-xs text-gray-500">Critical</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.urgent}</p>
            <p className="text-xs text-gray-500">Urgent</p>
          </div>
        </div>
      </div>

      <RequestBoard
        requests={sorted}
        myRequests={myRequests}
        searchParams={searchParams}
        userId={userId}
      />
    </div>
  )
}
