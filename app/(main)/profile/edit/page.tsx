'use client'

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
import { Avatar } from '@/components/ui/avatar'
import { toast } from '@/components/ui/toaster'
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '@/lib/constants'
import { Profile } from '@/types'
import * as Switch from '@radix-ui/react-switch'
import { Camera } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name required'),
  phone: z.string().min(10, 'Phone required'),
  email: z.string().email().optional().or(z.literal('')),
  blood_group: z.string().min(1, 'Blood group required'),
  district: z.string().optional(),
  nid_number: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function EditProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        setPrivacyMode(data.privacy_mode)
        setIsAvailable(data.is_available)
        reset({
          full_name: data.full_name,
          phone: data.phone,
          email: data.email || '',
          blood_group: data.blood_group,
          district: data.district || '',
          nid_number: '',
        })
      }
    }
    load()
  }, [])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(data: FormData) {
    if (!profile) return
    setLoading(true)

    let photoUrl = profile.profile_photo_url
    if (photoFile) {
      const { data: upload, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(`${profile.id}/avatar.${photoFile.name.split('.').pop()}`, photoFile, { upsert: true })
      if (!uploadError && upload) {
        const { data: urlData } = supabase.storage.from('profiles').getPublicUrl(upload.path)
        photoUrl = urlData.publicUrl
      }
    }

    const { error } = await supabase.from('profiles').update({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || null,
      blood_group: data.blood_group,
      district: data.district || null,
      privacy_mode: privacyMode,
      is_available: isAvailable,
      profile_photo_url: photoUrl,
    }).eq('id', profile.id)

    if (error) toast({ type: 'error', title: 'Error', description: error.message })
    else { toast({ type: 'success', title: 'Profile updated!' }); router.push(`/donor/${profile.id}`) }
    setLoading(false)
  }

  if (!profile) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Edit Profile</h1>
            <p className="text-gray-500 mt-2">Update your donor information</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {/* Photo upload */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="relative">
                  <Avatar src={photoPreview || profile.profile_photo_url} fallback={profile.full_name} size="xl" />
                  <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#C0392B] flex items-center justify-center cursor-pointer hover:bg-[#96281B] transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.full_name}</p>
                  <p className="text-sm text-gray-500">Click the camera icon to upload a photo</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full name" {...register('full_name')} error={errors.full_name?.message} />
                  <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
                </div>
                <Input label="Email (optional)" type="email" {...register('email')} error={errors.email?.message} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Blood group"
                    options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
                    value={watch('blood_group')}
                    onValueChange={(v) => setValue('blood_group', v)}
                    error={errors.blood_group?.message}
                  />
                  <Select
                    label="District"
                    placeholder="Select district"
                    options={BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))}
                    value={watch('district')}
                    onValueChange={(v) => setValue('district', v)}
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-4 py-4 border-y border-gray-100 dark:border-gray-800">
                  {[
                    { label: 'Available to donate', desc: 'Show as available in the donor directory', checked: isAvailable, onChange: setIsAvailable },
                    { label: 'Privacy mode', desc: 'Hide phone number from public listing (only revealed when matched)', checked: privacyMode, onChange: setPrivacyMode },
                  ].map(({ label, desc, checked, onChange }) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      <Switch.Root
                        checked={checked}
                        onCheckedChange={onChange}
                        className="w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-[#C0392B] transition-colors relative"
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-5.5" />
                      </Switch.Root>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">Cancel</Button>
                  <Button type="submit" loading={loading} className="flex-1">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
