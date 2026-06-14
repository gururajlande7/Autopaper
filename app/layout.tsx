import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import 'katex/dist/katex.min.css'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  title: {
    default: 'AutoPaper | Question Paper Generator',
    template: '%s | AutoPaper',
  },
  description:
    'Generate structured Class 10 question papers and export them as print-ready A4 PDFs.',
  applicationName: 'AutoPaper',
  icons: {
    icon: '/autopaper-logo.png',
    apple: '/autopaper-logo.png',
  },
  keywords: [
    'question paper generator',
    'Class 10',
    'A4 PDF',
    'teacher tools',
  ],
  openGraph: {
    title: 'AutoPaper | Question Paper Generator',
    description:
      'Generate structured Class 10 question papers and export them as print-ready A4 PDFs.',
    images: [
      {
        url: '/autopaper-logo.png',
        width: 1024,
        height: 1024,
        alt: 'AutoPaper logo',
      },
    ],
    siteName: 'AutoPaper',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background overflow-x-hidden`}>
      <body className="font-sans antialiased w-screen min-h-screen overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
