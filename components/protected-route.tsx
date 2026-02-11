'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCiras } from '@/contexts/ciras-context'
import { UserRole } from '@/types/ciras'

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: UserRole
}) {
  const { currentUser, isLoading } = useCiras()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // Check if user is authenticated
    if (!currentUser) {
      router.push('/login')
      return
    }

    // Check if user has the required role
    if (requiredRole && currentUser.role !== requiredRole) {
      router.push('/')
      return
    }
  }, [currentUser, isLoading, requiredRole, router])

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

  if (!currentUser || (requiredRole && currentUser.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
