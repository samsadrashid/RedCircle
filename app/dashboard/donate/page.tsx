'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { BANGLADESH_DISTRICTS } from '@/lib/constants'
import { addDays, format } from 'date-fns'
import { Droplets, Award } from 'lucide-react'

const schema = z.object({
  donated_at: z.string().min(1, 'Donation date required'),
  hospital_name: z.string().min(2, 'Hospital name required'),
  location_text: z.string().min(2, 'Location required'),
  district: z.string().min(1, 'District required'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function DonatePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { donated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm") },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const donatedAt = new Date(data.donated_at)
    const cooldownEndsAt = addDays(donatedAt, 90)

    const { data: donation, error } = await supabase.from('donations').insert({
      donor_id: user.id,
      donated_at: donatedAt.toISOString(),
      hospital_name: data.hospital_name,
      location_text: data.location_text,
      district: data.district,
      notes: data.notes || null,
      cooldown_ends_at: cooldownEndsAt.toISOString(),
    }).select().single()

    if (error) {
      toast({ type: 'error', title: 'Error', description: error.message })
    } else {
      // Generate certificate via API
      await fetch('/api/donations/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donation_id: donation.id }),
      })
      setSuccess(true)
      toast({ type: 'success', title: '🩸 Donation logged!', description: 'Certificate generated. Next eligible: ' + format(cooldownEndsAt, 'dd MMM yyyy') })
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="h-24 w-24 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
            <Award className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-3">
            Thank you! 🩸
          </h1>
          <p className="text-gray-500 mb-8">
            Your donation has been logged. Your certificate will be available shortly.
            Your next eligible donation date is 90 days from now.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            <Button variant="secondary" onClick={() => { setSuccess(false) }}>Log another donation</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Log Donation</h1>
          <p className="text-gray-500 mt-2">Record your blood donation and get a certificate</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Donation date & time"
                type="datetime-local"
                max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                {...register('donated_at')}
                error={errors.donated_at?.message}
              />
              <Input label="Hospital name" placeholder="Where did you donate?" {...register('hospital_name')} error={errors.hospital_name?.message} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Location details" placeholder="Ward, floor, etc." {...register('location_text')} error={errors.location_text?.message} />
                <Select
                  label="District"
                  placeholder="Select district"
                  options={BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))}
                  value={watch('district')}
                  onValueChange={(v) => setValue('district', v)}
                  error={errors.district?.message}
                />
              </div>
              <Textarea label="Notes (optional)" placeholder="Any notes about this donation..." rows={3} {...register('notes')} />

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900">
                <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                  <Droplets className="h-4 w-4 shrink-0" />
                  <p>After logging, you'll be on a 90-day cooldown. Your next donation will be available in approximately 3 months.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">Cancel</Button>
                <Button type="submit" loading={loading} className="flex-1">
                  <Droplets className="h-4 w-4" /> Log Donation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
