'use client'

import { MainNavigation } from '@/components/main-navigation'
import { useCiras } from '@/contexts/ciras-context'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { isLoading } = useCiras()
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

  return <MainNavigation />
}
