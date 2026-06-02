import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getValidUrl(url: string | undefined, fallback: string): string {
  try {
    if (url) new URL(url)
    return url || fallback
  } catch {
    return fallback
  }
}

export function createClient() {
  const cookieStore = cookies()
  const url = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://placeholder.supabase.co')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component — cookies can't be set here
        }
      },
    },
  })
}

export function createServiceClient() {
  const url = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://placeholder.supabase.co')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

  return createServerClient(url, key, {
    cookies: {
      getAll() { return [] },
      setAll() {},
    },
  })
}
