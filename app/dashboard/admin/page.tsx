'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AdminDashboard } from '@/components/admin-dashboard'
import { useCiras } from '@/contexts/ciras-context'
import { ArrowLeft, LogOut } from 'lucide-react'

export default function AdminDashboardPage() {
  const { currentUser, logout, isLoading } = useCiras()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== 'admin') {
    router.push('/login')
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold">Administrator Dashboard</h1>
            <p className="text-sm text-muted-foreground">System-wide issue overview and accountability metrics</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <AdminDashboard />
      </main>
    </div>
  )
}
