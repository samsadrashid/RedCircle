import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

const DO_LIST = [
  'Drink at least 2–3 extra glasses of water or juice the day before and day of donation',
  'Eat a healthy, iron-rich meal 2–3 hours before donating',
  'Get a good night\'s sleep before your donation',
  'Wear comfortable clothing with sleeves that can be easily rolled up',
  'Bring a valid ID or your donor card if you have one',
  'Tell the staff about any medications you are taking',
]

const DONT_LIST = [
  'Don\'t donate on an empty stomach',
  'Don\'t consume alcohol 24 hours before donating',
  'Don\'t eat fatty foods (chips, fried food) 3–4 hours before',
  'Don\'t smoke 2 hours before donating',
  'Don\'t donate if you\'re feeling unwell, have a fever, or cold',
  'Don\'t donate if you\'ve had a tattoo or piercing in the past 4 months',
  'Don\'t exercise vigorously right before donating',
]

export default function ChecklistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/education" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">Pre-Donation Checklist</h1>
        <p className="text-gray-500 mb-8">Follow these steps to have a safe and successful donation experience</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-5">
              <h2 className="font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> DO
              </h2>
              <ul className="space-y-3">
                {DO_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="pt-5">
              <h2 className="font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                <span className="h-5 w-5 flex items-center justify-center text-red-500">✗</span> DON'T
              </h2>
              <ul className="space-y-3">
                {DONT_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-red-500 mt-0.5 shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
