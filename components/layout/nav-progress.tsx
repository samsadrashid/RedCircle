'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setLoading(false)
    setWidth(0)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return
      if (href === pathname) return
      setLoading(true)
      setWidth(30)
      setTimeout(() => setWidth(70), 200)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none">
      <div
        className="h-full bg-[#C0392B] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(192,57,43,0.6)]"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
