import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/layout/theme-provider'

export const metadata: Metadata = {
  title: {
    default: 'RedCircle — Blood Donation Network',
    template: '%s | RedCircle',
  },
  description: 'Connect blood donors with those in need across Bangladesh. Save lives with RedCircle.',
  keywords: ['blood donation', 'Bangladesh', 'blood bank', 'donate blood', 'রক্তদান'],
  authors: [{ name: 'RedCircle Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'RedCircle — Blood Donation Network',
    description: 'Connect blood donors with those in need across Bangladesh.',
    type: 'website',
    locale: 'en_BD',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#C0392B' },
    { media: '(prefers-color-scheme: dark)', color: '#96281B' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
