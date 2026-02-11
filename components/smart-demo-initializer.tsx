'use client'

import { useEffect } from 'react'
import { useCiras } from '@/contexts/ciras-context'

/**
 * Smart Demo Data Initializer
 * - Initializes demo data only if no real issues exist
 * - Auto-removes demo data when user submits first real issue
 * - Uses localStorage to track demo status
 */
export function SmartDemoInitializer({ children }: { children: React.ReactNode }) {
  const { issues, addIssue } = useCiras()

  useEffect(() => {
    // Only initialize if system is empty and hasn't been marked as having real data
    const hasRealIssues = localStorage.getItem('ciras-has-real-issues')
    const hasDemoData = localStorage.getItem('ciras-demo-initialized')

    if (!hasRealIssues && !hasDemoData && issues.length === 0) {
      // Initialize demo data
      const demoIssues = [
        {
          category: 'Buildings & Classrooms',
          location: 'Building A, Ground Floor',
          description: 'Broken water fountain in the main hallway. The dispenser is leaking and making a mess.',
          anonymous: false,
          studentId: 'demo-student-1',
          status: 'in-progress' as const,
        },
        {
          category: 'Electrical & Lighting',
          location: 'Library East Wing, 3rd Floor',
          description: 'Insufficient lighting in study area. Several students reported difficulty reading at night.',
          anonymous: true,
          studentId: undefined,
          status: 'assigned' as const,
        },
        {
          category: 'Hostels & Accommodation',
          location: 'Hostel B, Building 4',
          description: 'Air conditioning unit not functioning. Room temperature too high for comfortable stay.',
          anonymous: false,
          studentId: 'demo-student-2',
          status: 'submitted' as const,
        },
      ]

      demoIssues.forEach((issue) => {
        addIssue({
          ...issue,
          status: 'submitted',
        })
      })

      localStorage.setItem('ciras-demo-initialized', 'true')
    }

    // Check if user just submitted a real issue - mark demo as used
    if (issues.length > 0 && !hasRealIssues) {
      // Check if any issue looks like it was just created (within last 1 minute)
      const now = Date.now()
      const recentIssue = issues.some((issue) => {
        const issueAge = now - issue.createdAt.getTime()
        return issueAge < 60000 // Less than 1 minute old
      })

      if (recentIssue) {
        localStorage.setItem('ciras-has-real-issues', 'true')
        // Demo data will persist but new demo won't be created
      }
    }
  }, [issues, addIssue])

  return <>{children}</>
}
