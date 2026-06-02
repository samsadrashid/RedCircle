'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Map, List, Phone, Navigation, Search, Clock, Droplets, X } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { BANGLADESH_DISTRICTS, AMBULANCE_NUMBERS } from '@/lib/constants'
import { Hospital } from '@/types'
import { cn } from '@/lib/utils'

const HospitalMap = dynamic(() => import('./hospital-map'), {
  ssr: false,
  loading: () => <div className="h-[400px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />,
})

interface Props {
  hospitals: Hospital[]
  searchParams: Record<string, string | undefined>
}

export function HospitalDirectory({ hospitals, searchParams }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [view, setView] = useState<'list' | 'map'>('list')
  const [search, setSearch] = useState(searchParams.q || '')

  function updateFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(searchParams).filter(([, v]) => v != null) as [string, string][])
    )
    if (value) params.set(key, value)
    else params.delete(key)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function clearFilters() {
    setSearch('')
    startTransition(() => router.push(pathname))
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return hospitals
    return hospitals.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.district.toLowerCase().includes(q)
    )
  }, [hospitals, search])

  const hasActiveFilters = !!(searchParams.district || searchParams.blood_bank || search.trim())

  return (
    <div className={isPending ? 'opacity-60 transition-opacity' : ''}>
      {/* Emergency numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900">
        <p className="col-span-2 sm:col-span-4 text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider mb-1">Emergency Hotlines</p>
        {AMBULANCE_NUMBERS.map(a => (
          <a
            key={a.number}
            href={`tel:${a.number}`}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-all border border-red-100 dark:border-red-900"
          >
            <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4 text-[#C0392B]" />
            </div>
            <div>
              <p className="font-bold text-[#C0392B] text-sm">{a.number}</p>
              <p className="text-xs text-gray-500 leading-tight">{a.name}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by hospital name, address or district…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters + view toggle row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {[{ id: 'list', icon: List, label: 'List' }, { id: 'map', icon: Map, label: 'Map' }].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id as typeof view)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === id ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          {/* District filter */}
          <div className="w-48">
            <Select
              placeholder="All districts"
              options={[{ value: '', label: 'All districts' }, ...BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))]}
              value={searchParams.district || ''}
              onValueChange={(v) => updateFilter('district', v || undefined)}
            />
          </div>

          {/* Blood bank toggle */}
          <button
            onClick={() => updateFilter('blood_bank', searchParams.blood_bank === 'true' ? undefined : 'true')}
            className={cn(
              'flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all',
              searchParams.blood_bank === 'true'
                ? 'bg-[#C0392B] border-[#C0392B] text-white'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#C0392B] hover:text-[#C0392B]'
            )}
          >
            <Droplets className="h-4 w-4" /> Blood bank only
          </button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X className="h-3.5 w-3.5" /> Clear all
            </button>
          )}

          {/* Result count */}
          <span className="ml-auto text-sm text-gray-400">
            {filtered.length} hospital{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {view === 'map' ? (
        <HospitalMap hospitals={filtered} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🏥"
          title="No hospitals found"
          description={hasActiveFilters ? 'Try adjusting your search or filters.' : 'No hospitals in the database yet.'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(hospital => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      )}
    </div>
  )
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/hospitals/${hospital.id}`} className="font-semibold text-gray-900 dark:text-white text-sm leading-snug flex-1 hover:text-[#C0392B] transition-colors">{hospital.name}</Link>
          <div className="flex gap-1 shrink-0 flex-wrap justify-end">
            {hospital.has_blood_bank && (
              <span className="flex items-center gap-1 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                <Droplets className="h-3 w-3" /> Blood
              </span>
            )}
            {hospital.is_24hr && (
              <span className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                <Clock className="h-3 w-3" /> 24h
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{hospital.address}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">{hospital.district}</p>
      </div>

      {/* Phone numbers */}
      <div className="space-y-2">
        <a
          href={`tel:${hospital.phone}`}
          className="flex items-center gap-2 text-sm text-[#C0392B] hover:underline font-medium"
        >
          <Phone className="h-4 w-4 shrink-0" /> {hospital.phone}
        </a>
        {hospital.emergency_phone && (
          <a
            href={`tel:${hospital.emergency_phone}`}
            className="flex items-center gap-2 text-sm text-orange-500 hover:underline"
          >
            <Phone className="h-4 w-4 shrink-0" /> {hospital.emergency_phone}
            <span className="text-xs text-gray-400">(Emergency)</span>
          </a>
        )}
        {hospital.ambulance_numbers.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {hospital.ambulance_numbers.map(num => (
              <a
                key={num}
                href={`tel:${num}`}
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {num}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Directions */}
      <a
        href={`https://maps.google.com/?q=${hospital.lat},${hospital.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-auto"
      >
        <Navigation className="h-4 w-4" /> Get directions
      </a>
    </Card>
  )
}
