import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const CARE_STEPS = [
  { time: 'Immediately after', icon: '🛌', steps: ['Rest for 10–15 minutes at the donation center', 'Drink extra fluids — at least 4 extra glasses throughout the day', 'Have a light snack or juice provided by the blood bank'] },
  { time: 'First 24 hours', icon: '⏰', steps: ['Avoid strenuous physical activity and heavy lifting', 'Keep the bandage on for 4–5 hours', 'If the site bleeds, apply firm pressure for a few minutes', 'Avoid alcohol for at least 24 hours', 'Drink plenty of water and fruit juice'] },
  { time: 'First few days', icon: '📅', steps: ['Eat iron-rich foods: spinach, lentils, meat, beans', 'Take vitamin C to help absorb iron', 'Avoid smoking for 2–3 hours', 'If you feel dizzy, sit or lie down immediately', 'Resume normal activities as you feel comfortable'] },
  { time: 'Warning signs', icon: '⚠️', steps: ['Contact the blood bank if you feel unwell after leaving', 'Seek care for unusual bruising or swelling at the needle site', 'Report if you develop a fever within the next week', 'Call if you remember any information that might affect blood safety'] },
]

export default function PostCarePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/education" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">Post-Donation Care</h1>
        <p className="text-gray-500 mb-8">How to recover quickly and safely after donating blood</p>
        <div className="space-y-4">
          {CARE_STEPS.map((section, i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span> {section.time}
                </h3>
                <ul className="space-y-2">
                  {section.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-[#C0392B] mt-0.5 shrink-0">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
