export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { HospitalDirectory } from '@/components/hospitals/hospital-directory'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Hospitals & Blood Banks' }

interface PageProps {
  searchParams: { district?: string; blood_bank?: string; q?: string }
}

export default async function HospitalsPage({ searchParams }: PageProps) {
  const supabase = createClient()

  let query = supabase.from('hospitals').select('*').order('name')
  if (searchParams.district) query = query.eq('district', searchParams.district)
  if (searchParams.blood_bank === 'true') query = query.eq('has_blood_bank', true)

  const { data: hospitals } = await query
  const all = hospitals || []

  const stats = {
    total: all.length,
    withBloodBank: all.filter(h => h.has_blood_bank).length,
    open24hr: all.filter(h => h.is_24hr).length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Hospitals & Blood Banks</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Find blood banks and emergency contacts across Bangladesh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total hospitals</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <p className="text-3xl font-bold text-[#C0392B]">{stats.withBloodBank}</p>
          <p className="text-xs text-gray-500 mt-0.5">With blood bank</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.open24hr}</p>
          <p className="text-xs text-gray-500 mt-0.5">Open 24 hours</p>
        </div>
      </div>

      <HospitalDirectory hospitals={all} searchParams={searchParams} />
    </div>
  )
}
