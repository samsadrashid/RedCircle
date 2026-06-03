'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { RequestCard } from './request-card'
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '@/lib/constants'
import { BloodRequest } from '@/types'
import { X } from 'lucide-react'

interface RequestBoardProps {
  requests: BloodRequest[]
  myRequests: (BloodRequest & { matches?: { id: string; status: string }[] })[] | null
  searchParams: Record<string, string | undefined>
  userId?: string
}

export function RequestBoard({ requests, myRequests, searchParams, userId }: RequestBoardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const activeTab = searchParams.tab === 'mine' && userId ? 'mine' : 'all'

  function setTab(tab: string) {
    const params = new URLSearchParams()
    if (tab !== 'all') params.set('tab', tab)
    startTransition(() => router.push(`${pathname}${params.toString() ? '?' + params.toString() : ''}`))
  }

  function updateFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(searchParams).filter(([, v]) => v != null) as [string, string][])
    )
    if (value) params.set(key, value)
    else params.delete(key)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function clearFilters() {
    const params = new URLSearchParams()
    if (activeTab === 'mine') params.set('tab', 'mine')
    startTransition(() => router.push(`${pathname}${params.toString() ? '?' + params.toString() : ''}`))
  }

  const hasActiveFilters = !!(searchParams.blood_group || searchParams.district || searchParams.urgency)

  return (
    <div className={isPending ? 'opacity-60 transition-opacity' : ''}>
      {/* Tabs */}
      <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-[#C0392B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}
        >
          All Requests
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
            {requests.length}
          </span>
        </button>
        {userId && (
          <button
            onClick={() => setTab('mine')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'mine' ? 'bg-[#C0392B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            My Requests
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'mine' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
              {myRequests?.length ?? 0}
            </span>
          </button>
        )}
      </div>

      {/* Filters — only on All tab */}
      {activeTab === 'all' && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="w-40">
            <Select
              placeholder="Blood group"
              options={[{ value: '_all', label: 'All groups' }, ...BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))]}
              value={searchParams.blood_group || '_all'}
              onValueChange={(v) => updateFilter('blood_group', v === '_all' ? undefined : v)}
            />
          </div>
          <div className="w-48">
            <Select
              placeholder="District"
              options={[{ value: '_all', label: 'All districts' }, ...BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))]}
              value={searchParams.district || '_all'}
              onValueChange={(v) => updateFilter('district', v === '_all' ? undefined : v)}
            />
          </div>
          <div className="w-44">
            <Select
              placeholder="Urgency"
              options={[
                { value: '_all', label: 'All urgency' },
                { value: 'critical', label: '🚨 Critical' },
                { value: 'urgent', label: '⚡ Urgent' },
                { value: 'normal', label: 'Normal' },
              ]}
              value={searchParams.urgency || '_all'}
              onValueChange={(v) => updateFilter('urgency', v === '_all' ? undefined : v)}
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* All Requests */}
      {activeTab === 'all' && (
        requests.length === 0 ? (
          <EmptyState
            icon="🩸"
            title="No open requests"
            description={hasActiveFilters ? 'No requests match your filters. Try removing some filters.' : 'There are no active blood requests right now.'}
            action={{ label: 'Post a request', href: '/requests/new' }}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request as BloodRequest} currentUserId={userId} />
            ))}
          </div>
        )
      )}

      {/* My Requests */}
      {activeTab === 'mine' && (
        !myRequests || myRequests.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No requests yet"
            description="You haven't posted any blood requests yet. Post one when someone needs blood."
            action={{ label: 'Post a request', href: '/requests/new' }}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request as BloodRequest}
                currentUserId={userId}
                showStatus
                responseCount={(request.matches ?? []).length}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
