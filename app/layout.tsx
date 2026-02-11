import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { CirasProvider } from '@/contexts/ciras-context'
import { SmartDemoInitializer } from '@/components/smart-demo-initializer'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CIRAS - Campus Issues Reporting and Accountability System',
  description: 'A comprehensive system for reporting, tracking, and resolving campus issues with full accountability',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CirasProvider>
          <SmartDemoInitializer>{children}</SmartDemoInitializer>
        </CirasProvider>
      </body>
    </html>
  )
}
