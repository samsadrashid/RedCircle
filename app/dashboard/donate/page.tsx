'use client'

import { useState, useEffect } from 'react'
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
import { BANGLADESH_DISTRICTS, COOLDOWN_DAYS } from '@/lib/constants'
import { addDays, subDays, format } from 'date-fns'
import { Droplets, Award, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const todayStr = format(new Date(), 'yyyy-MM-dd')
const minDateStr = format(subDays(new Date(), COOLDOWN_DAYS), 'yyyy-MM-dd')

const schema = z.object({
  donated_at: z.string()
    .min(1, 'Donation date required')
    .refine((v) => {
      const d = new Date(v)
      const today = new Date(); today.setHours(23, 59, 59, 999)
      const min = subDays(new Date(), COOLDOWN_DAYS); min.setHours(0, 0, 0, 0)
      return d <= today && d >= min
    }, 'Date must be within the past 90 days'),
  hospital_name: z.string().min(2, 'Hospital name required'),
  location_text: z.string().min(2, 'Location required'),
  district: z.string().min(1, 'District required'),
  notes: z.string().max(200, 'Max 200 characters').optional(),
})

type FormData = z.infer<typeof schema>

export default function DonatePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState(false)
  const [cooldownPreview, setCooldownPreview] = useState<string>(
    format(addDays(new Date(), COOLDOWN_DAYS), 'dd MMM yyyy')
  )

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { donated_at: todayStr },
  })

  const donatedAt = watch('donated_at')

  useEffect(() => {
    if (donatedAt) {
      try {
        const d = new Date(donatedAt)
        if (!isNaN(d.getTime())) {
          setCooldownPreview(format(addDays(d, COOLDOWN_DAYS), 'dd MMM yyyy'))
        }
      } catch { /* ignore invalid dates */ }
    }
  }, [donatedAt])

  async function onSubmit(data: FormData, force = false) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    if (!force) {
      const checkDate = new Date(data.donated_at)
      const { data: nearby } = await supabase
        .from('donations')
        .select('id')
        .eq('donor_id', user.id)
        .gte('donated_at', subDays(checkDate, 5).toISOString())
        .lte('donated_at', addDays(checkDate, 5).toISOString())
        .limit(1)

      if (nearby && nearby.length > 0) {
        setDuplicateWarning(true)
        setLoading(false)
        return
      }
    }

    const donatedDate = new Date(data.donated_at)
    const cooldownEndsAt = addDays(donatedDate, COOLDOWN_DAYS)

    const { data: donation, error } = await supabase.from('donations').insert({
      donor_id: user.id,
      donated_at: donatedDate.toISOString(),
      hospital_name: data.hospital_name,
      location_text: data.location_text,
      district: data.district,
      notes: data.notes || null,
      cooldown_ends_at: cooldownEndsAt.toISOString(),
      source: 'self',
    }).select().single()

    if (error) {
      toast({ type: 'error', title: 'Error', description: error.message })
      setLoading(false)
      return
    }

    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'cooldown_expired',
      title: 'Donation logged! 🩸',
      body: `Thank you. Your rest period runs until ${format(cooldownEndsAt, 'dd MMM yyyy')}. We'll remind you when you're available again.`,
      metadata: { cooldown_ends_at: cooldownEndsAt.toISOString() },
    })

    // Generate PDF certificate in background
    fetch('/api/donations/certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donation_id: donation.id }),
    })

    toast({
      type: 'success',
      title: '🩸 Donation logged!',
      description: `Rest period ends: ${format(cooldownEndsAt, 'dd MMM yyyy')}`,
    })
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="h-24 w-24 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-6">
            <Award className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-3">
            Thank you! 🩸
          </h1>
          <p className="text-gray-500 mb-2">
            Your donation has been logged. Rest period ends <strong>{cooldownPreview}</strong>.
          </p>
          <p className="text-sm text-gray-400 mb-8">A certificate will be generated and available on your profile.</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            <Button variant="secondary" onClick={() => setSuccess(false)}>Log another donation</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Log Donation</h1>
          <p className="text-gray-500 mt-2">Record your blood donation and get a certificate</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-5">
              <div>
                <Input
                  label="When did you donate?"
                  type="date"
                  min={minDateStr}
                  max={todayStr}
                  {...register('donated_at')}
                  error={errors.donated_at?.message}
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can log a past donation — rest period is calculated from that date.
                </p>
              </div>

              {cooldownPreview && (
                <div className="rounded-xl bg-[#C0392B] text-white p-4 space-y-1">
                  <p className="text-sm font-medium">
                    Donated on {donatedAt ? (() => { try { return format(new Date(donatedAt), 'dd MMM yyyy') } catch { return '' } })() : '—'}
                  </p>
                  <p className="text-sm">Rest period ends: <strong>{cooldownPreview}</strong></p>
                  <p className="text-xs opacity-80">Your profile will be hidden until then to protect you.</p>
                </div>
              )}

              {duplicateWarning && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      You may have already logged a donation around this date. Submit anyway?
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={loading}
                    onClick={() => handleSubmit((data) => onSubmit(data, true))()}
                  >
                    Yes, log anyway
                  </Button>
                </div>
              )}

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
              <Textarea label="Notes (optional)" placeholder="Any notes about this donation..." rows={3} {...register('notes')} error={errors.notes?.message} />

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">Cancel</Button>
                <Button type="submit" loading={loading} className="flex-1">
                  <Droplets className="h-4 w-4" /> Log Donation 🩸
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
