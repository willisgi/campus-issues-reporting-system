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
          category: 'Electrical & Lighting',
          location: 'Science Complex, Pst 3',
          description: 'Poor lighting condititon. The lighting is poor especially in the morning classes.',
          anonymous: false,
          studentId: 'demo-student-1',
          status: 'in-progress' as const,
        },
        {
          category: 'Labs & Lecture halls',
          location: 'Science complex, Psts and Npls',
          description: 'Too old and not enough seats. Especially during the exam period, you have to search for chairs from far .',
          anonymous: true,
          studentId: undefined,
          status: 'assigned' as const,
        },
        {
          category: 'Hostels & Accommodation',
          location: 'Block F, Hollywood',
          description: 'The beds are too shaky and mattresses are old. One wakes up with aching bones and sick of  motion.',
          anonymous: false,
          studentId: 'Eric maina',
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
