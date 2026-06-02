'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { addDays } from 'date-fns'

const schema = z.object({
  patient_name: z.string().min(2, 'Patient name required'),
  blood_group_needed: z.string().min(1, 'Blood group required'),
  units_needed: z.coerce.number().int().min(1).max(10),
  hospital_name: z.string().min(2, 'Hospital name required'),
  district: z.string().min(1, 'District required'),
  location_text: z.string().min(2, 'Location required'),
  urgency: z.enum(['critical', 'urgent', 'normal']),
  contact_phone: z.string().min(10, 'Valid phone required'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function NewRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/auth/login?redirect=/requests/new')
    })
  }, [])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { units_needed: 1, urgency: 'normal' },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/auth/login?redirect=/requests/new')
      return
    }

    const { error } = await supabase.from('blood_requests').insert({
      ...data,
      requester_id: user.id,
      expires_at: addDays(new Date(), 7).toISOString(),
    })

    if (error) {
      toast({ type: 'error', title: 'Error', description: error.message })
    } else {
      toast({ type: 'success', title: 'Request posted!', description: 'Matching donors will be notified.' })
      router.push('/requests')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/requests" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Requests
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Post Blood Request</h1>
          <p className="text-gray-500 mt-2">Fill in the details and matching donors will be notified.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Patient name" placeholder="Full name of patient" {...register('patient_name')} error={errors.patient_name?.message} />
                <Input label="Contact phone" placeholder="+8801XXXXXXXXX" {...register('contact_phone')} error={errors.contact_phone?.message} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  label="Blood group needed"
                  placeholder="Select blood group"
                  options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
                  value={watch('blood_group_needed')}
                  onValueChange={(v) => setValue('blood_group_needed', v)}
                  error={errors.blood_group_needed?.message}
                />
                <Input label="Units needed" type="number" min={1} max={10} {...register('units_needed')} error={errors.units_needed?.message} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  label="Urgency"
                  placeholder="Select urgency"
                  options={[
                    { value: 'critical', label: '🚨 Critical — within hours' },
                    { value: 'urgent', label: '⚡ Urgent — within 24h' },
                    { value: 'normal', label: 'Normal — within a week' },
                  ]}
                  value={watch('urgency')}
                  onValueChange={(v) => setValue('urgency', v as 'critical' | 'urgent' | 'normal')}
                  error={errors.urgency?.message}
                />
                <Select
                  label="District"
                  placeholder="Select district"
                  options={BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))}
                  value={watch('district')}
                  onValueChange={(v) => setValue('district', v)}
                  error={errors.district?.message}
                />
              </div>

              <Input label="Hospital name" placeholder="Name of hospital" {...register('hospital_name')} error={errors.hospital_name?.message} />
              <Input label="Location details" placeholder="Ward number, floor, etc." {...register('location_text')} error={errors.location_text?.message} />
              <Textarea label="Additional message (optional)" placeholder="Any important context for donors..." rows={3} {...register('message')} />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">Cancel</Button>
                <Button type="submit" loading={loading} className="flex-1">Post Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
