export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { BLOOD_GROUPS, BLOOD_CAN_DONATE_TO, BLOOD_COMPATIBILITY } from '@/lib/constants'
import { BloodGroupBadge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blood Education Center' }

const LEARN_TOPICS = [
  { href: '/education/benefits', icon: '💪', title: 'Benefits of Donating', desc: 'Why giving blood is good for you and others' },
  { href: '/education/checklist', icon: '✅', title: 'Pre-Donation Checklist', desc: 'What to eat, avoid, and prepare before donating' },
  { href: '/education/post-care', icon: '🛌', title: 'Post-Donation Care', desc: 'How to recover quickly after donation' },
  { href: '/education/myths', icon: '🔍', title: 'Myths vs Facts', desc: 'Debunking common misconceptions about blood donation' },
  { href: '/education/faq', icon: '❓', title: 'FAQ', desc: 'Frequently asked questions about blood donation' },
]

export default function EducationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="mb-10">
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">Blood Education Center</h1>
        <p className="text-gray-500 mt-2">Learn everything about blood types, donation, and saving lives</p>
      </div>

      {/* Blood Type Compatibility Matrix */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-2">Blood Type Compatibility</h2>
        <p className="text-gray-500 mb-6">Which blood types can donate to and receive from each other</p>

        <div className="overflow-x-auto">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Blood Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Can Donate To</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Can Receive From</th>
                  </tr>
                </thead>
                <tbody>
                  {BLOOD_GROUPS.map((bg, i) => (
                    <tr key={bg} className={`border-b border-gray-50 dark:border-gray-800 last:border-0 ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/50' : ''}`}>
                      <td className="p-4">
                        <BloodGroupBadge bloodGroup={bg} size="md" />
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {BLOOD_CAN_DONATE_TO[bg].map(t => (
                            <BloodGroupBadge key={t} bloodGroup={t} size="sm" />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {BLOOD_COMPATIBILITY[bg].map(t => (
                            <BloodGroupBadge key={t} bloodGroup={t} size="sm" />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <Card className="p-5 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900">
            <h3 className="font-semibold text-[#C0392B] mb-2">🅾️ O- Universal Donor</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">O negative donors can give blood to anyone regardless of blood type. This makes O- blood especially valuable for emergencies.</p>
          </Card>
          <Card className="p-5 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🅰🅱 AB+ Universal Recipient</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">AB positive patients can receive blood from any blood type, making them universal recipients in transfusion situations.</p>
          </Card>
        </div>
      </section>

      {/* Topic cards */}
      <section>
        <h2 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-6">Learn More</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARN_TOPICS.map(topic => (
            <Link key={topic.href} href={topic.href}>
              <Card hover className="p-5">
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{topic.title}</h3>
                <p className="text-sm text-gray-500">{topic.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
