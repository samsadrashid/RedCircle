'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '@/lib/constants'
import { User, Phone, ArrowRight } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  blood_group: z.string().min(1, 'Select your blood group'),
  district: z.string().min(1, 'Select your district'),
})

type FormData = z.infer<typeof schema>

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [defaultName, setDefaultName] = useState('')

  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace('/auth/login'); return }
      const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || ''
      setDefaultName(name)
      form.setValue('full_name', name)
    })
  }, [])

  async function onSubmit(data: FormData) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const formatted = data.phone.startsWith('+') ? data.phone : `+880${data.phone.replace(/^0/, '')}`

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: data.full_name,
      phone: formatted,
      email: user.email || null,
      blood_group: data.blood_group,
      district: data.district,
      nid_verified: false,
      is_available: true,
      privacy_mode: false,
      donor_level: 'new',
      total_donations: 0,
      onboarding_complete: true,
    })

    if (error) {
      toast({ type: 'error', title: 'Error', description: error.message })
    } else {
      toast({ type: 'success', title: 'Profile created!', description: 'Welcome to RedCircle.' })
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🩸</span>
        </div>
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">One last step</h1>
        <p className="text-gray-500 dark:text-gray-400">Complete your donor profile to get started</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Your full name"
              icon={<User className="h-4 w-4" />}
              {...form.register('full_name')}
              error={form.formState.errors.full_name?.message}
            />
            <Input
              label="Phone number"
              placeholder="01XXXXXXXXX"
              icon={<Phone className="h-4 w-4" />}
              {...form.register('phone')}
              error={form.formState.errors.phone?.message}
            />
            <Select
              label="Blood group"
              placeholder="Select blood group"
              options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
              value={form.watch('blood_group')}
              onValueChange={(v) => form.setValue('blood_group', v)}
              error={form.formState.errors.blood_group?.message}
            />
            <Select
              label="District"
              placeholder="Select your district"
              options={BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))}
              value={form.watch('district')}
              onValueChange={(v) => form.setValue('district', v)}
              error={form.formState.errors.district?.message}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Complete profile <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
