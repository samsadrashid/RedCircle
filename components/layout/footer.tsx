import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-heading font-bold text-lg text-gray-900 dark:text-white">
              <div className="h-7 w-7 rounded-lg bg-[#C0392B] flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              Red<span className="text-[#C0392B]">Circle</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Connecting blood donors with those in need across Bangladesh. Every drop counts.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/donors" className="hover:text-[#C0392B] transition-colors">Find Donors</Link></li>
              <li><Link href="/requests" className="hover:text-[#C0392B] transition-colors">Blood Requests</Link></li>
              <li><Link href="/campaigns" className="hover:text-[#C0392B] transition-colors">Campaigns</Link></li>
              <li><Link href="/hospitals" className="hover:text-[#C0392B] transition-colors">Hospitals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/education" className="hover:text-[#C0392B] transition-colors">Blood Types</Link></li>
              <li><Link href="/education/benefits" className="hover:text-[#C0392B] transition-colors">Benefits</Link></li>
              <li><Link href="/education/faq" className="hover:text-[#C0392B] transition-colors">FAQ</Link></li>
              <li><Link href="/education/myths" className="hover:text-[#C0392B] transition-colors">Myths vs Facts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Emergency</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="font-medium text-[#C0392B]">DGHS: 16401</li>
              <li className="font-medium text-[#C0392B]">Red Crescent: 01730-336699</li>
              <li className="font-medium text-[#C0392B]">National: 999</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} RedCircle. Built with ❤️ for Bangladesh.
          </p>
          <p className="text-sm text-gray-400">
            Every donation can save up to 3 lives.
          </p>
        </div>
      </div>
    </footer>
  )
}
