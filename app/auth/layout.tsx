import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl text-gray-900 dark:text-white">
          <div className="h-8 w-8 rounded-lg bg-[#C0392B] flex items-center justify-center">
            <Heart className="h-4 w-4 text-white fill-white" />
          </div>
          <span>Red<span className="text-[#C0392B]">Circle</span></span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
