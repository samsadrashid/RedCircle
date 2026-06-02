export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DonorDirectory } from '@/components/donors/donor-directory'
import { DonorCardSkeleton } from '@/components/ui/skeleton'
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Find Donors' }

interface PageProps {
  searchParams: {
    blood_group?: string
    district?: string
    available?: string
    q?: string
  }
}

async function getDonors(searchParams: PageProps['searchParams']) {
  const supabase = createClient()
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('nid_verified', true)
    .order('total_donations', { ascending: false })
    .limit(50)

  if (searchParams.blood_group && BLOOD_GROUPS.includes(searchParams.blood_group as typeof BLOOD_GROUPS[number])) {
    query = query.eq('blood_group', searchParams.blood_group)
  }
  if (searchParams.district) {
    query = query.eq('district', searchParams.district)
  }
  if (searchParams.available === 'true') {
    query = query.eq('is_available', true)
  }
  if (searchParams.q) {
    query = query.ilike('full_name', `%${searchParams.q}%`)
  }

  const { data, error } = await query
  return data || []
}

export default async function DonorsPage({ searchParams }: PageProps) {
  const donors = await getDonors(searchParams)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Find Donors</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Search {donors.length > 0 ? `${donors.length}+ ` : ''}verified donors across Bangladesh
        </p>
      </div>

      <Suspense fallback={
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 9 }).map((_, i) => <DonorCardSkeleton key={i} />)}
        </div>
      }>
        <DonorDirectory donors={donors} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
