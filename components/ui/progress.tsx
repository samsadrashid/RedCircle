'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  indicatorClassName?: string
  label?: string
}

export function Progress({ value, className, indicatorClassName, label }: ProgressProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>}
      <ProgressPrimitive.Root
        className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800', className)}
        value={value}
      >
        <ProgressPrimitive.Indicator
          className={cn('h-full w-full flex-1 rounded-full transition-all duration-500', indicatorClassName || 'bg-[#C0392B]')}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}
