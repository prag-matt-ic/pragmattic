import './globals.css'

import type { Metadata } from 'next'
import { Kumbh_Sans } from 'next/font/google'

import CustomCursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const fontSans = Kumbh_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { template: '%s | Pragmattic', default: 'Pragmattic | Design and Engineering' },
  description:
    'Helping teams build interactive 3D experiences, launch web and mobile apps, and streamline their workflows using AI.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} w-full bg-black font-sans antialiased`}>
        <Nav />
        {children}
        <Footer />
        <CustomCursor />
      </body>
    </html>
  )
}
