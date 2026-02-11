'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Users, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative">
              <Image
                src="/ciras-logo.jpg"
                alt="CIRAS Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CIRAS
              </h1>
              <p className="text-xs text-muted-foreground">Campus Accountability</p>
            </div>
          </Link>
          <div className="flex gap-2">
            <Link href="/track">
              <Button variant="outline" size="sm">Track Issues</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-balance leading-tight">
                Report Issues. <span className="bg-gradient-to-r from-primary via-accent to-green-500 bg-clip-text text-transparent">Track Progress.</span> Ensure Accountability.
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                The Campus Issues Reporting and Accountability System (CIRAS) provides a transparent, streamlined approach to reporting campus concerns and tracking resolutions with real-time monitoring and institutional accountability.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary via-accent to-green-500 hover:opacity-90">
                  <AlertCircle className="w-5 h-5" />
                  Get Started
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <BarChart3 className="w-5 h-5" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-6 bg-card border-border hover:bg-card/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Easy Reporting</h3>
                  <p className="text-sm text-muted-foreground">Report any campus issue with optional anonymity</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:bg-card/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Real-time Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor your issue status every step of the way</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:bg-card/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Department Assignment</h3>
                  <p className="text-sm text-muted-foreground">Issues routed to the right department automatically</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border hover:bg-card/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Full Accountability</h3>
                  <p className="text-sm text-muted-foreground">Complete audit logs and performance metrics</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card/40 backdrop-blur border-y border-border/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Transparent Tracking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Issue Submission</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">20</div>
              <p className="text-sm text-muted-foreground">Issue Categories</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">10</div>
              <p className="text-sm text-muted-foreground">Departments</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">How CIRAS Works</h2>
            <p className="text-muted-foreground">A streamlined process for campus accountability</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Report', description: 'Submit your campus issue with details' },
              { step: 2, title: 'Assign', description: 'Admin assigns to relevant department' },
              { step: 3, title: 'Track', description: 'Monitor progress and updates' },
              { step: 4, title: 'Resolve', description: 'Issue resolved with full accountability' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-8 -right-8 w-16 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Info */}
      <section className="bg-card/30 backdrop-blur border-y border-border/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">For All Campus Members</h2>
              <p className="text-muted-foreground">Different roles, unified accountability</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/50 hover:border-primary/80 transition-all">
                <h3 className="text-xl font-bold text-foreground mb-3">Students</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Report issues anonymously or with your identity. Track resolution progress in real-time with complete transparency.
                </p>
                <Link href="/report">
                  <Button className="w-full" size="sm">
                    Report Issue
                  </Button>
                </Link>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/50 hover:border-accent/80 transition-all">
                <h3 className="text-xl font-bold text-foreground mb-3">Department Staff</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  View assigned issues, update status, add resolution comments, and ensure accountability within your department.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="w-full" size="sm">
                    Staff Portal
                  </Button>
                </Link>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/50 hover:border-orange-500/80 transition-all">
                <h3 className="text-xl font-bold text-foreground mb-3">Administrators</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Full system oversight, real-time analytics, SLA tracking, and institutional accountability metrics.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="w-full" size="sm">
                    Admin Portal
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/ciras-logo.jpg" alt="CIRAS" width={32} height={32} className="rounded" />
              <div>
                <p className="font-semibold text-foreground">CIRAS</p>
                <p className="text-xs text-muted-foreground">Campus Accountability System</p>
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm flex-1">
              Promoting institutional transparency and accountability in campus operations
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
