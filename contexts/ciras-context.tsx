'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Issue, User, UserRole, IssueStatus, ActivityLog, IssueComment } from '@/types/ciras'

interface CirasContextType {
  currentUser: User | null
  setCurrentUser: (user: User) => void
  logout: () => void
  issues: Issue[]
  addIssue: (issue: Omit<Issue, 'id' | 'comments' | 'activityLog' | 'createdAt'>) => Issue
  updateIssueStatus: (issueId: string, newStatus: IssueStatus, actor: User) => void
  assignIssueToDepartment: (issueId: string, department: string, actor: User) => void
  setDeadline: (issueId: string, deadline: Date, actor: User) => void
  addComment: (issueId: string, comment: Omit<IssueComment, 'id' | 'timestamp'>) => void
  getIssuesByStudent: (studentId: string) => Issue[]
  getIssuesByDepartment: (department: string) => Issue[]
  getOverdueIssues: () => Issue[]
  getDepartmentStats: (department?: string) => any
  isLoading: boolean
}

const CirasContext = createContext<CirasContextType | undefined>(undefined)

// All departments
const ALL_DEPARTMENTS = [
  'Estates',
  'Student Affairs',
  'Campus Security',
  'Health Services',
  'Academic Affairs',
  'Registrar',
  'Finance',
  'ICT',
  'Facilities',
  'General',
]

export function CirasProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ciras-user')
      const savedIssues = localStorage.getItem('ciras-issues')
      
      if (savedUser) {
        const user = JSON.parse(savedUser)
        setCurrentUserState(user)
      }
      
      if (savedIssues) {
        const parsed = JSON.parse(savedIssues)
        // Convert date strings back to Date objects
        const issuesWithDates = parsed.map((issue: any) => ({
          ...issue,
          createdAt: new Date(issue.createdAt),
          deadline: issue.deadline ? new Date(issue.deadline) : undefined,
          resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : undefined,
          comments: issue.comments.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          })),
          activityLog: issue.activityLog.map((a: any) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          })),
        }))
        setIssues(issuesWithDates)
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setCurrentUser = useCallback((user: User) => {
    setCurrentUserState(user)
    localStorage.setItem('ciras-user', JSON.stringify(user))
  }, [])

  const logout = useCallback(() => {
    setCurrentUserState(null)
    localStorage.removeItem('ciras-user')
  }, [])

  // Persist issues whenever they change
  useEffect(() => {
    localStorage.setItem('ciras-issues', JSON.stringify(issues))
  }, [issues])

  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const addIssue = useCallback((issueData: Omit<Issue, 'id' | 'comments' | 'activityLog' | 'createdAt'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: generateId('ISS'),
      comments: [],
      activityLog: [
        {
          id: generateId('ACT'),
          action: 'Issue Submitted',
          actor: issueData.anonymous ? 'Anonymous' : currentUser?.name || 'Unknown',
          actorRole: 'student',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      status: 'submitted',
    }

    setIssues((prev) => [...prev, newIssue])
    return newIssue
  }, [currentUser])

  const updateIssueStatus = useCallback((issueId: string, newStatus: IssueStatus, actor: User) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const updatedIssue = { ...issue, status: newStatus }
          if (newStatus === 'resolved') {
            updatedIssue.resolvedAt = new Date()
          }

          // Add activity log
          updatedIssue.activityLog.push({
            id: generateId('ACT'),
            action: `Status changed to ${newStatus}`,
            actor: actor.name,
            actorRole: actor.role,
            timestamp: new Date(),
          })

          return updatedIssue
        }
        return issue
      })
    )
  }, [])

  const assignIssueToDepartment = useCallback((issueId: string, department: string, actor: User) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const updatedIssue = { ...issue, departmentAssigned: department, status: 'assigned' }
          updatedIssue.activityLog.push({
            id: generateId('ACT'),
            action: `Assigned to ${department}`,
            actor: actor.name,
            actorRole: actor.role,
            timestamp: new Date(),
          })
          return updatedIssue
        }
        return issue
      })
    )
  }, [])

  const setDeadline = useCallback((issueId: string, deadline: Date, actor: User) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const updatedIssue = { ...issue, deadline }
          updatedIssue.activityLog.push({
            id: generateId('ACT'),
            action: `Deadline set to ${deadline.toLocaleDateString()}`,
            actor: actor.name,
            actorRole: actor.role,
            timestamp: new Date(),
          })
          return updatedIssue
        }
        return issue
      })
    )
  }, [])

  const addComment = useCallback((issueId: string, comment: Omit<IssueComment, 'id' | 'timestamp'>) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const newComment: IssueComment = {
            ...comment,
            id: generateId('COM'),
            timestamp: new Date(),
          }
          return { ...issue, comments: [...issue.comments, newComment] }
        }
        return issue
      })
    )
  }, [])

  const getIssuesByStudent = useCallback((studentId: string) => {
    return issues.filter((issue) => issue.studentId === studentId)
  }, [issues])

  const getIssuesByDepartment = useCallback((department: string) => {
    return issues.filter((issue) => issue.departmentAssigned === department)
  }, [issues])

  const getOverdueIssues = useCallback(() => {
    const now = new Date()
    return issues.filter((issue) => issue.deadline && issue.deadline < now && issue.status !== 'resolved')
  }, [issues])

  const getDepartmentStats = useCallback((department?: string) => {
    const filteredIssues = department ? getIssuesByDepartment(department) : issues
    const resolved = filteredIssues.filter((i) => i.status === 'resolved').length
    const overdue = filteredIssues.filter((i) => i.deadline && i.deadline < new Date() && i.status !== 'resolved').length

    return {
      totalIssues: filteredIssues.length,
      resolved,
      pending: filteredIssues.length - resolved,
      overdue,
      avgResolutionTime: resolved > 0
        ? filteredIssues
          .filter((i) => i.resolvedAt)
          .reduce((sum, i) => sum + (i.resolvedAt!.getTime() - i.createdAt.getTime()), 0) /
        resolved /
        (1000 * 60 * 60)
        : 0,
    }
  }, [issues, getIssuesByDepartment])

  return (
    <CirasContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        issues,
        addIssue,
        updateIssueStatus,
        assignIssueToDepartment,
        setDeadline,
        addComment,
        getIssuesByStudent,
        getIssuesByDepartment,
        getOverdueIssues,
        getDepartmentStats,
        isLoading,
      }}
    >
      {children}
    </CirasContext.Provider>
  )
}

export function useCiras() {
  const context = useContext(CirasContext)
  if (!context) {
    throw new Error('useCiras must be used within CirasProvider')
  }
  return context
}
