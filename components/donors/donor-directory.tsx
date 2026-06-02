'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { DonorCard } from './donor-card'
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '@/lib/constants'
import { Profile } from '@/types'

interface DonorDirectoryProps {
  donors: Profile[]
  searchParams: Record<string, string | undefined>
}

export function DonorDirectory({ donors, searchParams }: DonorDirectoryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [showFilters, setShowFilters] = useState(false)

  function updateFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).filter(([, v]) => v != null) as [string, string][]
      )
    )
    if (value) params.set(key, value)
    else params.delete(key)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const hasFilters = searchParams.blood_group || searchParams.district || searchParams.available

  return (
    <div>
      {/* Search & filter bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name..."
            icon={<Search className="h-4 w-4" />}
            defaultValue={searchParams.q}
            onChange={(e) => updateFilter('q', e.target.value || undefined)}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className={hasFilters ? 'border-[#C0392B] text-[#C0392B]' : ''}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasFilters && (
            <span className="h-2 w-2 rounded-full bg-[#C0392B] -mt-1" />
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="grid sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-fade-in">
          <Select
            label="Blood group"
            placeholder="All blood groups"
            options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
            value={searchParams.blood_group}
            onValueChange={(v) => updateFilter('blood_group', v)}
          />
          <Select
            label="District"
            placeholder="All districts"
            options={BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))}
            value={searchParams.district}
            onValueChange={(v) => updateFilter('district', v)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Availability</label>
            <div className="flex gap-2">
              {[
                { value: '', label: 'All' },
                { value: 'true', label: 'Available only' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('available', opt.value || undefined)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${searchParams.available === opt.value || (!searchParams.available && !opt.value) ? 'bg-[#C0392B] text-white border-[#C0392B]' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {hasFilters && (
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={() => { updateFilter('blood_group', undefined); updateFilter('district', undefined); updateFilter('available', undefined) }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#C0392B] transition-colors"
              >
                <X className="h-4 w-4" /> Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {isPending ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse space-y-4">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : donors.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No donors found"
          description="Try adjusting your filters or search criteria. New donors join RedCircle every day."
          action={{ label: 'Clear all filters', href: '/donors' }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {donors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      )}
    </div>
  )
}
