import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Phone, Navigation, MapPin, Clock, Droplets, ArrowLeft, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('hospitals').select('name, district').eq('id', params.id).single()
  if (!data) return { title: 'Hospital Not Found' }
  return { title: `${data.name} — ${data.district}` }
}

export default async function HospitalDetailPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: hospital } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!hospital) notFound()

  const { data: nearbyRequests } = await supabase
    .from('blood_requests')
    .select('id, patient_name, blood_group_needed, units_needed, urgency, created_at')
    .eq('district', hospital.district)
    .eq('status', 'open')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link href="/hospitals" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to hospitals
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-3">
            <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
              <Building2 className="h-7 w-7 text-[#C0392B]" />
            </div>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white leading-snug">{hospital.name}</h1>
              <p className="text-gray-500 mt-1">{hospital.district}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {hospital.has_blood_bank && (
              <span className="flex items-center gap-1.5 text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-medium">
                <Droplets className="h-4 w-4" /> Blood Bank Available
              </span>
            )}
            {hospital.is_24hr && (
              <span className="flex items-center gap-1.5 text-sm bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                <Clock className="h-4 w-4" /> Open 24 Hours
              </span>
            )}
          </div>
        </div>

        {/* Info card */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-5">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
                <p className="text-sm text-gray-500 mt-0.5">{hospital.address}</p>
                <p className="text-sm text-gray-400">{hospital.district}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Phone numbers */}
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Contact Numbers</p>
                <a href={`tel:${hospital.phone}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#C0392B]">{hospital.phone}</p>
                    <p className="text-xs text-gray-500">Main line</p>
                  </div>
                  <Phone className="h-4 w-4 text-gray-400" />
                </a>
                {hospital.emergency_phone && (
                  <a href={`tel:${hospital.emergency_phone}`} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-orange-600">{hospital.emergency_phone}</p>
                      <p className="text-xs text-gray-500">Emergency</p>
                    </div>
                    <Phone className="h-4 w-4 text-orange-400" />
                  </a>
                )}
                {hospital.ambulance_numbers?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 mt-1">Ambulance</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.ambulance_numbers.map((num: string) => (
                        <a key={num} href={`tel:${num}`} className="text-sm bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors">
                          {num}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Directions */}
            <a
              href={`https://maps.google.com/?q=${hospital.lat},${hospital.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors"
            >
              <Navigation className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Get directions on Google Maps</p>
                <p className="text-xs text-gray-500">Lat {hospital.lat.toFixed(4)}, Lng {hospital.lng.toFixed(4)}</p>
              </div>
            </a>
          </CardContent>
        </Card>

        {/* Nearby blood requests */}
        {nearbyRequests && nearbyRequests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Open requests in {hospital.district}</h2>
              <Link href={`/requests?district=${encodeURIComponent(hospital.district)}`} className="text-sm text-[#C0392B] hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {nearbyRequests.map(req => (
                <Link key={req.id} href={`/requests/${req.id}`}>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <span className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${req.urgency === 'critical' ? 'bg-red-600' : req.urgency === 'urgent' ? 'bg-orange-500' : 'bg-gray-400'}`}>
                        {req.blood_group_needed}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{req.patient_name}</p>
                        <p className="text-xs text-gray-500">{req.units_needed} unit{req.units_needed > 1 ? 's' : ''} · {req.urgency}</p>
                      </div>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
