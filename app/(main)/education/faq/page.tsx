import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const FAQS = [
  { q: 'Who can donate blood?', a: 'Generally, adults aged 18–65 who weigh at least 50kg, are in good health, and have not donated in the past 90 days.' },
  { q: 'How often can I donate blood?', a: 'Whole blood can be donated every 90 days (about 3 months). This gives your body time to fully replenish red blood cells.' },
  { q: 'Does blood donation hurt?', a: 'You may feel a slight pinch when the needle is inserted, but most donors feel little to no pain during the process.' },
  { q: 'How long does the process take?', a: 'The actual blood draw takes about 8–10 minutes. The entire process including registration and rest time is about 30–45 minutes.' },
  { q: 'What happens to my blood after donation?', a: 'Your blood is tested, processed, and separated into components (red cells, plasma, platelets), each of which can help different patients.' },
  { q: 'Can I donate if I have a tattoo or piercing?', a: 'Yes, if the tattoo or piercing was done at a licensed facility at least 4 months ago using sterile equipment.' },
  { q: 'Will I feel weak after donating?', a: 'Most people feel fine. Some donors experience mild dizziness. Rest for 15 minutes and drink plenty of fluids afterward.' },
  { q: 'Can I donate blood if I am on medication?', a: 'It depends on the medication. Common medications like aspirin, blood pressure meds, or birth control usually don\'t disqualify you. Consult the blood bank.' },
  { q: 'What blood type is most needed?', a: 'O negative (O-) is always in high demand as it\'s the universal donor type. AB plasma is also universally compatible.' },
  { q: 'Is donated blood tested for diseases?', a: 'Yes. All donated blood is screened for HIV, hepatitis B & C, syphilis, and other infections before it can be used.' },
]

export default function FAQPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/education" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Education
        </Link>
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">❓ {faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
