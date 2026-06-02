import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const BENEFITS = [
  { icon: '❤️', title: 'Reduces risk of heart disease', desc: 'Regular blood donation helps reduce iron overload in the body, which is linked to lower risk of cardiovascular disease.' },
  { icon: '🔬', title: 'Free health screening', desc: 'Every time you donate, your blood is tested for various conditions including HIV, hepatitis, and blood pressure — a free mini health check.' },
  { icon: '🏃', title: 'Burns calories', desc: 'Donating one pint of blood can burn up to 650 calories as your body works to replenish the lost blood.' },
  { icon: '🧬', title: 'Stimulates blood cell production', desc: 'After donating, your body produces new blood cells to replace the donated ones, keeping your system healthy and active.' },
  { icon: '😊', title: 'Psychological benefits', desc: 'The act of helping others creates a sense of fulfillment and can reduce stress, improve emotional well-being, and boost self-esteem.' },
  { icon: '🌟', title: 'Save up to 3 lives', desc: 'A single donation can be separated into red cells, plasma, and platelets — each saving a different patient\'s life.' },
  { icon: '🩺', title: 'Reduces cancer risk', desc: 'Studies suggest that regular blood donation may lower the risk of certain cancers due to reduced iron levels in the body.' },
  { icon: '⚡', title: 'Liver health', desc: 'Excess iron in the body can lead to liver damage. Donating blood helps maintain healthy iron levels, benefiting liver function.' },
]

export default function BenefitsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/education" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#C0392B] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Education
        </Link>
        <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-2">Benefits of Donating Blood</h1>
        <p className="text-gray-500 mb-8">Giving blood is good for you too — here's why</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {BENEFITS.map((b, i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
