import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

const MYTHS = [
  { myth: 'Donating blood makes you weak for weeks', fact: 'Your body replenishes the donated volume within 24 hours. Most donors return to normal activity the same day.' },
  { myth: 'You can get HIV or other diseases from donating', fact: 'Completely false. Blood banks use sterile, single-use equipment. There is zero risk of contracting any disease from donating.' },
  { myth: 'People with high blood pressure cannot donate', fact: 'You can usually donate as long as your blood pressure is within an acceptable range on the day of donation.' },
  { myth: 'You need a special diet before donating', fact: 'Eat a normal healthy meal and stay hydrated. Avoid fatty foods 3–4 hours before, as they can affect blood testing.' },
  { myth: 'Old people cannot donate blood', fact: 'Generally, donors up to age 65 can donate. Some blood banks accept older donors in good health. Age alone isn\'t disqualifying.' },
  { myth: 'Donating blood takes a very long time', fact: 'The actual blood draw takes about 8–10 minutes. The entire visit is usually 30–45 minutes including check-in and rest.' },
  { myth: 'You cannot donate if you are taking vitamins', fact: 'Most vitamins and supplements are fine. Common exceptions include high-dose aspirin or blood thinners — ask the blood bank.' },
  { myth: 'Blood type O can only donate to O', fact: 'O positive can donate to A+, B+, O+, and AB+. O negative can donate to all 8 blood types.' },
]

export default function MythsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/education" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">Myths vs Facts</h1>
        <p className="text-gray-500 mb-8">Clearing up common misconceptions about blood donation</p>
        <div className="space-y-4">
          {MYTHS.map((item, i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-5 space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400 text-sm">MYTH: {item.myth}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"><span className="font-medium text-green-700 dark:text-green-400">FACT: </span>{item.fact}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
