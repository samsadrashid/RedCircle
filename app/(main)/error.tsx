'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function MainError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[MainError]', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-[#C0392B]" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-3">Something went wrong</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">An unexpected error occurred. Please try again.</p>
        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mb-6">Error: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>Go home</Button>
        </div>
      </div>
    </div>
  )
}
