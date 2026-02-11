'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCiras } from '@/contexts/ciras-context'
import { ArrowLeft } from 'lucide-react'
import { IssuesTable } from '@/components/issues-table'

// Lazy load analytics component for better initial load time
const TrackingAnalytics = dynamic(() => import('@/components/tracking-analytics').then(mod => ({ default: mod.TrackingAnalytics })), {
  loading: () => (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-card/40 h-80 animate-pulse" />
      <Card className="p-6 bg-card/40 h-80 animate-pulse" />
    </div>
  ),
  ssr: true,
})

export default function TrackPage() {
  const { issues } = useCiras()
  const [searchId, setSearchId] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Memoize derived data
  const departments = useMemo(
    () => new Set(issues.filter((i) => i.departmentAssigned).map((i) => i.departmentAssigned)),
    [issues]
  )

  const statuses = useMemo(
    () => new Set(issues.map((i) => i.status)),
    [issues]
  )

  // Stats
  const stats = useMemo(
    () => ({
      total: issues.length,
      resolved: issues.filter((i) => i.status === 'resolved').length,
      inProgress: issues.filter((i) => i.status === 'in-progress').length,
      pending: issues.filter((i) => i.status === 'submitted' || i.status === 'assigned').length,
    }),
    [issues]
  )

  const handleClearFilters = () => {
    setSearchId('')
    setFilterDept('all')
    setFilterStatus('all')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Track Issues</h1>
            <p className="text-sm text-muted-foreground">Monitor campus issue progress and view system analytics</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 backdrop-blur">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/10 border-green-500/50 backdrop-blur">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-accent">{stats.resolved}</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-warning/20 to-warning/10 border-warning/50 backdrop-blur">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-warning">{stats.inProgress}</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 backdrop-blur">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-primary">{stats.pending}</p>
              </div>
            </Card>
          </div>

          {/* Analytics Charts - Lazy loaded */}
          <TrackingAnalytics issues={issues} />

          {/* Filters and Search */}
          <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
            <h3 className="font-bold text-lg text-foreground mb-4">Filter & Search Issues</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Search Issue ID</label>
                <Input
                  type="text"
                  placeholder="Enter Issue ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Department</label>
                <Select value={filterDept} onValueChange={setFilterDept}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Departments</SelectItem>
                    {Array.from(departments).map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-foreground">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Status</SelectItem>
                    {Array.from(statuses).map((status) => (
                      <SelectItem key={status} value={status} className="text-foreground">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Issues Table */}
          <IssuesTable
            issues={issues}
            searchId={searchId}
            filterDept={filterDept}
            filterStatus={filterStatus}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
    </div>
  )
}
