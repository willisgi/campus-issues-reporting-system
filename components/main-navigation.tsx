'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCiras } from '@/contexts/ciras-context'
import { AlertCircle, BarChart3, Users, FileText, TrendingUp, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MainNavigation() {
  const { currentUser, logout, issues, getOverdueIssues } = useCiras()
  const router = useRouter()
  const overdueIssues = getOverdueIssues()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Quick stats
  const totalIssues = issues.length
  const resolvedIssues = issues.filter((i) => i.status === 'resolved').length
  const pendingIssues = issues.filter((i) => i.status !== 'resolved').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CIRAS
              </h1>
              <p className="text-xs text-muted-foreground">Campus Accountability</p>
            </div>
          </Link>

          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-foreground font-semibold">{currentUser.name}</p>
                <Badge variant="outline" className="text-xs">{currentUser.role.toUpperCase()}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-balance">
              Welcome to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CIRAS</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Transparent campus issue reporting, tracking, and accountability in one place
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-card/40 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className="text-3xl font-bold text-primary">{totalIssues}</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur border-border/50 hover:border-accent/50 transition-all">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-accent">{resolvedIssues}</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur border-border/50 hover:border-warning/50 transition-all">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">{pendingIssues}</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur border-border/50 hover:border-destructive/50 transition-all">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-destructive">{overdueIssues.length}</p>
                {overdueIssues.length > 0 && (
                  <p className="text-xs text-destructive/70 mt-2">Requires attention</p>
                )}
              </div>
            </Card>
          </div>

          {/* Navigation Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Report Issue - For All Users */}
            <Link href="/report">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/50 hover:border-primary hover:from-primary/20 transition-all cursor-pointer h-full">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Report an Issue</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submit a new campus concern with optional anonymity
                    </p>
                  </div>
                  <Button className="w-full" size="sm">
                    Start Reporting
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Track Issue - For All Users */}
            <Link href="/track">
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/50 hover:border-accent hover:from-accent/20 transition-all cursor-pointer h-full">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Track Issues</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitor issue progress and view analytics
                    </p>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">
                    View Tracking
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Monitoring - For Admin */}
            {currentUser?.role === 'admin' && (
              <Link href="/monitoring">
                <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/50 hover:border-orange-500 hover:from-orange-500/20 transition-all cursor-pointer h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Monitoring Dashboard</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Real-time system metrics and recurrent issues
                      </p>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">
                      View Monitoring
                    </Button>
                  </div>
                </Card>
              </Link>
            )}

            {/* Department Dashboard - For Staff */}
            {currentUser?.role === 'staff' && (
              <Link href="/dashboard/staff">
                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/50 hover:border-purple-500 hover:from-purple-500/20 transition-all cursor-pointer h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">My Department</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage assigned issues and updates
                      </p>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">
                      Open Dashboard
                    </Button>
                  </div>
                </Card>
              </Link>
            )}

            {/* Admin Dashboard - For Admin */}
            {currentUser?.role === 'admin' && (
              <Link href="/dashboard/admin">
                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/50 hover:border-purple-500 hover:from-purple-500/20 transition-all cursor-pointer h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Admin Dashboard</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Full system control and assignment management
                      </p>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">
                      Open Dashboard
                    </Button>
                  </div>
                </Card>
              </Link>
            )}

            {/* Login - For Unauthenticated Users */}
            {!currentUser && (
              <Link href="/login">
                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/50 hover:border-purple-500 hover:from-purple-500/20 transition-all cursor-pointer h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Staff / Admin Login</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Access your department or admin dashboard
                      </p>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">
                      Login
                    </Button>
                  </div>
                </Card>
              </Link>
            )}
          </div>

          {/* Alerts Section */}
          {overdueIssues.length > 0 && (
            <Card className="p-6 bg-destructive/10 border-destructive/50">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground">
                    {overdueIssues.length} Overdue Issue{overdueIssues.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {overdueIssues.length === 1
                      ? `1 issue is overdue and requires immediate attention`
                      : `${overdueIssues.length} issues are overdue and require immediate attention`}
                  </p>
                  {currentUser?.role === 'admin' && (
                    <Link href="/monitoring" className="inline-block mt-3">
                      <Button size="sm">View Overdue Issues</Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
