'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays, subDays } from 'date-fns'
import { Droplets, CheckCircle } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { createClient } from '@/lib/supabase/client'
import { COOLDOWN_DAYS } from '@/lib/constants'

const maxDate = format(new Date(), 'yyyy-MM-dd')
const minDate = format(subDays(new Date(), COOLDOWN_DAYS), 'yyyy-MM-dd')

const schema = z.object({
  donated_at: z.string()
    .min(1, 'Date required')
    .refine((v) => {
      const d = new Date(v)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      const min = subDays(new Date(), COOLDOWN_DAYS)
      min.setHours(0, 0, 0, 0)
      return d <= today && d >= min
    }, 'Date must be within the past 90 days'),
  hospital_name: z.string().optional(),
  notes: z.string().max(200, 'Max 200 characters').optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function LogDonationSheet({ open, onClose, onSuccess }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState(false)
  const [cooldownPreview, setCooldownPreview] = useState<string | null>(null)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { donated_at: maxDate },
  })

  const donatedAt = watch('donated_at')

  useEffect(() => {
    if (donatedAt) {
      const d = new Date(donatedAt)
      if (!isNaN(d.getTime())) {
        setCooldownPreview(format(addDays(d, COOLDOWN_DAYS), 'dd MMM yyyy'))
      } else {
        setCooldownPreview(null)
      }
    }
  }, [donatedAt])

  useEffect(() => {
    if (!open) {
      reset({ donated_at: maxDate })
      setSuccess(false)
      setDuplicateWarning(false)
      setCooldownPreview(null)
    }
  }, [open, reset])

  async function submitDonation(data: FormData, force = false) {
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

    const { error } = await supabase.from('donations').insert({
      donor_id: user.id,
      donated_at: donatedDate.toISOString(),
      hospital_name: data.hospital_name?.trim() || 'Not specified',
      location_text: '',
      district: '',
      notes: data.notes || null,
      cooldown_ends_at: cooldownEndsAt.toISOString(),
      source: 'self',
    })

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

    setSuccess(true)
    toast({
      type: 'success',
      title: 'Logged! 🩸',
      description: `Rest period: ${format(cooldownEndsAt, 'dd MMM yyyy')}`,
    })
    router.refresh()
    onSuccess?.()
    setLoading(false)
  }

  const donatedAtFormatted = donatedAt
    ? (() => { try { return format(new Date(donatedAt), 'dd MMM yyyy') } catch { return '' } })()
    : ''

  return (
    <Modal open={open} onClose={onClose} title={success ? 'Donation Logged!' : 'Log a Donation'}>
      {success ? (
        <div className="flex flex-col items-center py-6 gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your donation has been recorded. Rest period ends <strong>{cooldownPreview}</strong>.
          </p>
          <Button onClick={() => { setSuccess(false); onClose() }} className="w-full">Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit((data) => submitDonation(data, false))} className="space-y-5 pt-2">
          <div>
            <Input
              label="When did you donate?"
              type="date"
              min={minDate}
              max={maxDate}
              {...register('donated_at')}
              error={errors.donated_at?.message}
            />
            <p className="text-xs text-gray-400 mt-1">
              You can log a past donation — rest period is calculated from that date.
            </p>
          </div>

          {cooldownPreview && donatedAtFormatted && (
            <div className="rounded-xl bg-[#C0392B] text-white p-4 space-y-1">
              <p className="text-sm font-medium">Donated on {donatedAtFormatted}</p>
              <p className="text-sm">Rest period ends: <strong>{cooldownPreview}</strong></p>
              <p className="text-xs opacity-80">Your profile will be hidden until then to protect you.</p>
            </div>
          )}

          {duplicateWarning && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3 space-y-2">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                You may have already logged a donation around this date. Submit anyway?
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={loading}
                onClick={() => handleSubmit((data) => submitDonation(data, true))()}
              >
                Yes, log anyway
              </Button>
            </div>
          )}

          <Input
            label="Where did you donate? (optional)"
            placeholder="Hospital or blood bank name"
            {...register('hospital_name')}
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Any additional notes..."
            rows={3}
            {...register('notes')}
            error={errors.notes?.message}
          />

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">
              <Droplets className="h-4 w-4" /> Log My Donation 🩸
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
