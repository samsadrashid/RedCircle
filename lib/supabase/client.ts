import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  try {
    if (url) new URL(url)
    return url || 'https://placeholder.supabase.co'
  } catch {
    return 'https://placeholder.supabase.co'
  }
})()

const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}
