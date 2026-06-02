'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { Phone, User, ArrowRight, ArrowLeft, Shield, CheckCircle } from 'lucide-react'

const step1Schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
})

const step2Schema = z.object({
  blood_group: z.string().min(1, 'Select your blood group'),
  district: z.string().min(1, 'Select your district'),
})

const step3Schema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type Step1Form = z.infer<typeof step1Schema>
type Step2Form = z.infer<typeof step2Schema>
type Step3Form = z.infer<typeof step3Schema>

const STEPS = ['Your Info', 'Blood Details', 'Verify', 'Done']

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Step1Form & Step2Form>>({})
  const [phone, setPhone] = useState('')

  const step1 = useForm<Step1Form>({ resolver: zodResolver(step1Schema) })
  const step2 = useForm<Step2Form>({ resolver: zodResolver(step2Schema) })
  const step3 = useForm<Step3Form>({ resolver: zodResolver(step3Schema) })

  async function handleGoogleSignUp() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/onboarding`,
      },
    })
    if (error) {
      toast({ type: 'error', title: 'Google sign-up failed', description: error.message })
      setGoogleLoading(false)
    }
  }

  async function handleStep1(data: Step1Form) {
    setLoading(true)
    const formatted = data.phone.startsWith('+') ? data.phone : `+880${data.phone.replace(/^0/, '')}`
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    if (error) {
      toast({ type: 'error', title: 'Error', description: error.message })
    } else {
      setFormData({ ...formData, ...data })
      setPhone(formatted)
      toast({ type: 'success', title: 'OTP sent!', description: 'Check your phone.' })
      setStep(2)
    }
    setLoading(false)
  }

  async function handleStep3(data: Step3Form) {
    setLoading(true)
    const { data: authData, error } = await supabase.auth.verifyOtp({
      phone,
      token: data.otp,
      type: 'sms',
    })
    if (error || !authData.user) {
      toast({ type: 'error', title: 'Invalid OTP', description: error?.message })
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: authData.user.id,
      full_name: formData.full_name!,
      phone,
      email: formData.email || null,
      blood_group: formData.blood_group as string,
      district: formData.district,
      nid_verified: false,
      is_available: true,
      privacy_mode: false,
      donor_level: 'new',
      total_donations: 0,
      onboarding_complete: true,
    })

    if (profileError) {
      toast({ type: 'error', title: 'Profile error', description: profileError.message })
    } else {
      setStep(3)
    }
    setLoading(false)
  }

  const steps = [
    // Step 0: Blood details first
    <div key="step2" className="space-y-4">
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🩸</span>
        </div>
        <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white">Blood group & location</h2>
        <p className="text-sm text-gray-500 mt-1">This helps connect you with the right patients</p>
      </div>
      <form onSubmit={step2.handleSubmit((d) => { setFormData({ ...formData, ...d }); setStep(1) })} className="space-y-4">
        <Select
          label="Blood group"
          placeholder="Select blood group"
          options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
          value={step2.watch('blood_group')}
          onValueChange={(v) => step2.setValue('blood_group', v)}
          error={step2.formState.errors.blood_group?.message}
        />
        <Select
          label="District"
          placeholder="Select your district"
          options={BANGLADESH_DISTRICTS.map(d => ({ value: d, label: d }))}
          value={step2.watch('district')}
          onValueChange={(v) => step2.setValue('district', v)}
          error={step2.formState.errors.district?.message}
        />
        <Button type="submit" className="w-full" size="lg">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>,

    // Step 1: Personal info
    <div key="step1" className="space-y-4">
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white">Your information</h2>
        <p className="text-sm text-gray-500 mt-1">We&apos;ll send you a verification code</p>
      </div>
      <form onSubmit={step1.handleSubmit(handleStep1)} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Your full name"
          icon={<User className="h-4 w-4" />}
          {...step1.register('full_name')}
          error={step1.formState.errors.full_name?.message}
        />
        <Input
          label="Phone number"
          placeholder="01XXXXXXXXX"
          icon={<Phone className="h-4 w-4" />}
          {...step1.register('phone')}
          error={step1.formState.errors.phone?.message}
        />
        <Input
          label="Email (optional)"
          type="email"
          placeholder="you@example.com"
          {...step1.register('email')}
          error={step1.formState.errors.email?.message}
        />
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setStep(0)} className="flex-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button type="submit" loading={loading} className="flex-1" size="lg">
            Send OTP
          </Button>
        </div>
      </form>
    </div>,

    // Step 2: OTP
    <div key="step3" className="space-y-4">
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white">Verify your phone</h2>
        <p className="text-sm text-gray-500 mt-1">OTP sent to <strong>{phone}</strong></p>
      </div>
      <form onSubmit={step3.handleSubmit(handleStep3)} className="space-y-4">
        <Input
          label="Verification code"
          placeholder="000000"
          maxLength={6}
          {...step3.register('otp')}
          error={step3.formState.errors.otp?.message}
          className="text-center tracking-widest text-2xl"
        />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Verify & Create Account
        </Button>
      </form>
    </div>,

    // Step 3: Done
    <div key="done" className="text-center space-y-6 py-4">
      <div className="h-20 w-20 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>
      <div>
        <h2 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-2">Welcome, {formData.full_name}!</h2>
        <p className="text-gray-500 dark:text-gray-400">Your account has been created. You&apos;re now part of the RedCircle family.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={() => router.push('/profile/edit')} className="w-full">
          Complete your profile
        </Button>
        <Button size="lg" variant="secondary" onClick={() => router.push('/dashboard')} className="w-full">
          Go to Dashboard
        </Button>
      </div>
    </div>,
  ]

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">Create account</h1>
        <p className="text-gray-500 dark:text-gray-400">Join thousands of donors in Bangladesh</p>
      </div>

      {/* Step indicator */}
      {step < 3 && (
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.slice(0, 3).map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? 'bg-[#C0392B] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`h-0.5 w-8 rounded transition-all ${i < step ? 'bg-[#C0392B]' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          {/* Google sign-up — only on first step */}
          {step === 0 && (
            <>
              <Button
                variant="secondary"
                size="lg"
                className="w-full mb-4"
                onClick={handleGoogleSignUp}
                loading={googleLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">or sign up with phone</span>
                </div>
              </div>
            </>
          )}

          <div className="animate-fade-in">{steps[step]}</div>

          {step < 3 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#C0392B] font-medium hover:underline">Sign in</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
