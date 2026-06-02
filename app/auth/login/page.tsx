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
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { Phone, Mail, ArrowRight } from 'lucide-react'

const phoneSchema = z.object({
  phone: z.string().min(10, 'Enter a valid phone number'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

const emailSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type PhoneForm = z.infer<typeof phoneSchema>
type OTPForm = z.infer<typeof otpSchema>
type EmailForm = z.infer<typeof emailSchema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [method, setMethod] = useState<'phone' | 'email'>('email')
  const [step, setStep] = useState<'input' | 'otp'>('input')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const phoneForm = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema) })
  const otpForm = useForm<OTPForm>({ resolver: zodResolver(otpSchema) })
  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) })

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    if (error) {
      toast({ type: 'error', title: 'Google sign-in failed', description: error.message })
      setGoogleLoading(false)
    }
  }

  async function handlePhoneSubmit(data: PhoneForm) {
    setLoading(true)
    const formatted = data.phone.startsWith('+') ? data.phone : `+880${data.phone.replace(/^0/, '')}`
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    if (error) {
      toast({ type: 'error', title: 'Error', description: error.message })
    } else {
      setPhone(formatted)
      setStep('otp')
      toast({ type: 'success', title: 'OTP sent!', description: 'Check your phone for the verification code.' })
    }
    setLoading(false)
  }

  async function handleOTPSubmit(data: OTPForm) {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ phone, token: data.otp, type: 'sms' })
    if (error) {
      toast({ type: 'error', title: 'Invalid OTP', description: error.message })
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleEmailSubmit(data: EmailForm) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    if (error) {
      toast({ type: 'error', title: 'Sign in failed', description: error.message })
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400">Sign in to your RedCircle account</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Google OAuth */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full mb-4"
            onClick={handleGoogleSignIn}
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
              <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">or sign in with</span>
            </div>
          </div>

          {/* Method toggle */}
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 mb-6">
            {[{ id: 'email', label: 'Email', icon: Mail }, { id: 'phone', label: 'Phone', icon: Phone }].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setMethod(id as typeof method); setStep('input') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${method === id ? 'bg-[#C0392B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          {method === 'phone' ? (
            <>
              {step === 'input' ? (
                <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                  <Input
                    label="Phone number"
                    placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                    icon={<Phone className="h-4 w-4" />}
                    {...phoneForm.register('phone')}
                    error={phoneForm.formState.errors.phone?.message}
                  />
                  <Button type="submit" loading={loading} className="w-full" size="lg">
                    Send OTP <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-4">
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      OTP sent to <span className="font-medium text-gray-900 dark:text-white">{phone}</span>
                    </p>
                  </div>
                  <Input
                    label="Verification code"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    {...otpForm.register('otp')}
                    error={otpForm.formState.errors.otp?.message}
                    className="text-center tracking-widest text-xl"
                  />
                  <Button type="submit" loading={loading} className="w-full" size="lg">Verify & Sign in</Button>
                  <button type="button" onClick={() => setStep('input')} className="w-full text-sm text-gray-500 hover:text-[#C0392B] transition-colors">
                    Change number
                  </button>
                </form>
              )}
            </>
          ) : (
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                {...emailForm.register('email')}
                error={emailForm.formState.errors.email?.message}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...emailForm.register('password')}
                error={emailForm.formState.errors.password?.message}
              />
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Sign in <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#C0392B] font-medium hover:underline">
              Sign up free
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
