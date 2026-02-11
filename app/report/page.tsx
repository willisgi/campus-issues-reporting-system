'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReportForm } from '@/components/report-form'
import { ArrowLeft } from 'lucide-react'

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Report an Issue</h1>
            <p className="text-sm text-muted-foreground">Help us improve campus by reporting concerns</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ReportForm />
      </main>
    </div>
  )
}
