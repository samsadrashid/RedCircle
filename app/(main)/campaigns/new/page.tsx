'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { BloodGroupBadge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '@/lib/constants'
import { BloodGroup } from '@/types'
import { ArrowLeft } from 'lucide-react'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  venue_name: z.string().min(2, 'Venue name required'),
  venue_address: z.string().min(5, 'Venue address required'),
  district: z.string().min(1, 'District required'),
  event_date: z.string().min(1, 'Event date required'),
  event_time: z.string().min(1, 'Event time required'),
  volunteers_needed: z.coerce.number().int().min(1).max(1000),
})

type FormData = z.infer<typeof schema>

export default function NewCampaignPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [selectedGroups, setSelectedGroups] = useState<BloodGroup[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/auth/login?redirect=/campaigns/new')
    })
  }, [])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { volunteers_needed: 20 },
  })

  function toggleBloodGroup(bg: BloodGroup) {
    setSelectedGroups(prev =>
      prev.includes(bg) ? prev.filter(g => g !== bg) : [...prev, bg]
    )
  }

  async function onSubmit(data: FormData) {
    if (selectedGroups.length === 0) {
      toast({ type: 'error', title: 'Select blood groups', description: 'Choose at least one blood group needed' })
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error } = await supabase.from('campaigns').insert({
      ...data,
      organizer_id: user.id,
      blood_groups_needed: selectedGroups,
    })

    if (error) toast({ type: 'error', title: 'Error', description: error.message })
    else { toast({ type: 'success', title: 'Campaign created!', description: 'Your blood drive is now live.' }); router.push('/campaigns') }
    setLoading(false)
  }

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Campaigns
        </Link>

        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Create Blood Campaign</h1>
          <p className="text-gray-500 mt-2">Organize a blood donation drive in your community.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input label="Campaign title" placeholder="e.g. Dhaka University Blood Drive 2024" {...register('title')} error={errors.title?.message} />
              <Textarea label="Description" placeholder="Tell donors about this campaign..." rows={3} {...register('description')} error={errors.description?.message} />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blood groups needed
                </label>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => toggleBloodGroup(bg as BloodGroup)}
                      className={`transition-all ${selectedGroups.includes(bg as BloodGroup) ? 'ring-2 ring-[#C0392B] ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <BloodGroupBadge bloodGroup={bg as BloodGroup} size="md" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Venue name" placeholder="Hospital, school, etc." {...register('venue_name')} error={errors.venue_name?.message} />
                <Select
                  label="District"
                  placeholder="Select district"
                  options={BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))}
                  value={watch('district')}
                  onValueChange={(v) => setValue('district', v)}
                  error={errors.district?.message}
                />
              </div>

              <Textarea label="Venue address" placeholder="Full address" rows={2} {...register('venue_address')} error={errors.venue_address?.message} />

              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="Event date" type="date" min={tomorrow} {...register('event_date')} error={errors.event_date?.message} />
                <Input label="Event time" type="time" {...register('event_time')} error={errors.event_time?.message} />
                <Input label="Volunteers needed" type="number" min={1} {...register('volunteers_needed')} error={errors.volunteers_needed?.message} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">Cancel</Button>
                <Button type="submit" loading={loading} className="flex-1">Create Campaign</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
