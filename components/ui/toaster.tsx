'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  description?: string
}

interface ToastStore {
  toasts: Toast[]
  add: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

// We use a simple event emitter pattern to avoid circular imports
const toastListeners: ((toast: Omit<Toast, 'id'>) => void)[] = []

export function toast(t: Omit<Toast, 'id'>) {
  toastListeners.forEach(l => l(t))
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    const listener = (t: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).slice(2)
      setToasts(prev => [...prev, { ...t, id }])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000)
    }
    toastListeners.push(listener)
    return () => {
      const i = toastListeners.indexOf(listener)
      if (i > -1) toastListeners.splice(i, 1)
    }
  }, [])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  }

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-2xl border shadow-lg bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 w-full max-w-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full'
          )}
          open={true}
          onOpenChange={(open) => {
            if (!open) setToasts(prev => prev.filter(x => x.id !== t.id))
          }}
        >
          {icons[t.type]}
          <div className="flex-1 min-w-0">
            <ToastPrimitive.Title className="font-semibold text-sm text-gray-900 dark:text-white">
              {t.title}
            </ToastPrimitive.Title>
            {t.description && (
              <ToastPrimitive.Description className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t.description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          >
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm outline-none" />
    </ToastPrimitive.Provider>
  )
}

// Need React import for useState/useEffect
import React from 'react'
