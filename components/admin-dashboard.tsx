'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCiras } from '@/contexts/ciras-context'
import { Issue, CATEGORY_TO_DEPARTMENT } from '@/types/ciras'
import { format, formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertCircle, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

const DEPARTMENTS = [
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

export function AdminDashboard() {
  const { issues, assignIssueToDepartment, setDeadline, currentUser } = useCiras()
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [assignDept, setAssignDept] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')

  // Calculate stats
  const stats = {
    totalIssues: issues.length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    pending: issues.filter((i) => i.status !== 'resolved').length,
    overdue: issues.filter((i) => i.deadline && i.deadline < new Date() && i.status !== 'resolved').length,
  }

  // Department stats
  const deptStats = DEPARTMENTS.map((dept) => {
    const deptIssues = issues.filter((i) => i.departmentAssigned === dept)
    return {
      name: dept,
      total: deptIssues.length,
      resolved: deptIssues.filter((i) => i.status === 'resolved').length,
      pending: deptIssues.filter((i) => i.status !== 'resolved').length,
    }
  }).filter((d) => d.total > 0)

  // Category breakdown - count issues by issue category
  const categoryMap = new Map<string, number>()
  issues.forEach((issue) => {
    categoryMap.set(issue.category, (categoryMap.get(issue.category) || 0) + 1)
  })
  const categoryData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name: name.substring(0, 20), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Top 8 categories

  // Location breakdown - count issues by location
  const locationMap = new Map<string, number>()
  issues.forEach((issue) => {
    locationMap.set(issue.location, (locationMap.get(issue.location) || 0) + 1)
  })
  const locationData = Array.from(locationMap.entries())
    .map(([name, value]) => ({ name: name.substring(0, 20), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Top 8 locations

  // Status breakdown
  const statusData = [
    { name: 'Submitted', value: issues.filter((i) => i.status === 'submitted').length, color: '#808080' },
    { name: 'Assigned', value: issues.filter((i) => i.status === 'assigned').length, color: '#3B82F6' },
    { name: 'In Progress', value: issues.filter((i) => i.status === 'in-progress').length, color: '#60A5FA' },
    { name: 'Resolved', value: issues.filter((i) => i.status === 'resolved').length, color: '#10B981' },
    { name: 'Overdue', value: issues.filter((i) => i.deadline && i.deadline < new Date() && i.status !== 'resolved').length, color: '#EF4444' },
  ].filter((d) => d.value > 0)

  const unassignedIssues = issues.filter((i) => !i.departmentAssigned)
  const overdueIssues = issues.filter((i) => i.deadline && i.deadline < new Date() && i.status !== 'resolved')

  const handleAssign = (issue: Issue) => {
    if (!assignDept || !currentUser) return
    assignIssueToDepartment(issue.id, assignDept, currentUser)
    setAssignDept('')
  }

  const handleSetDeadline = (issue: Issue) => {
    if (!deadlineDate || !currentUser) return
    const deadline = new Date(deadlineDate)
    setDeadline(issue.id, deadline, currentUser)
    setDeadlineDate('')
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
              <p className="text-4xl font-bold text-primary">{stats.totalIssues}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-4xl font-bold text-success">{stats.resolved}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-success/50" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-4xl font-bold text-primary">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overdue</p>
              <p className="text-4xl font-bold text-destructive">{stats.overdue}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-destructive/50" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Department Performance</h3>
          {deptStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #444',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                <Bar dataKey="pending" fill="#3B82F6" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          )}
        </Card>

        {/* Issue Status Distribution */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Issue Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #444',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          )}
        </Card>
      </div>

      {/* Recurrent Issues - Category & Location */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Issues by Category */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Issues by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" width={100} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #444',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" name="Number of Issues" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          )}
        </Card>

        {/* Issues by Location */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Issues by Location</h3>
          {locationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" width={100} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #444',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#8B5CF6" name="Number of Issues" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          )}
        </Card>
      </div>

      {/* Overdue Issues Alert */}
      {overdueIssues.length > 0 && (
        <Card className="p-6 bg-destructive/10 border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-destructive mb-2">Overdue Issues ({overdueIssues.length})</h3>
              <p className="text-sm text-destructive/80 mb-4">
                The following issues have exceeded their resolution deadline and require immediate attention.
              </p>
              <div className="grid gap-2">
                {overdueIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between bg-card p-3 rounded-lg border border-destructive/30">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{issue.id}</p>
                      <p className="text-sm text-foreground">{issue.category} - {issue.location}</p>
                    </div>
                    <div className="text-right text-xs text-destructive">
                      Due: {issue.deadline && format(issue.deadline, 'MMM dd, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Unassigned Issues */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Unassigned Issues ({unassignedIssues.length})</h3>

        {unassignedIssues.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">All issues have been assigned</p>
        ) : (
          <div className="space-y-4">
            {unassignedIssues.map((issue) => (
              <div key={issue.id} className="p-4 bg-secondary rounded-lg border border-border space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-mono text-xs text-muted-foreground mb-1">{issue.id}</p>
                    <p className="font-semibold text-foreground mb-1">{issue.category} • {issue.location}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                  </div>
                  <Badge className="whitespace-nowrap bg-muted/30 text-muted-foreground border-muted/50">
                    {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
                  </Badge>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select value={assignDept} onValueChange={setAssignDept}>
                    <SelectTrigger className="w-40 bg-card border-border text-foreground text-sm h-9">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-40 bg-card border-border text-foreground text-sm h-9"
                  />

                  <Button
                    size="sm"
                    onClick={() => {
                      handleAssign(issue)
                      if (assignDept && deadlineDate) {
                        handleSetDeadline(issue)
                        setSelectedIssue(null)
                      }
                    }}
                    disabled={!assignDept || !deadlineDate}
                  >
                    Assign & Set Deadline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* All Issues List */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">All Issues ({issues.length})</h3>

        {issues.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No issues yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Issue ID</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Department</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Deadline</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const isOverdue = issue.deadline && issue.deadline < new Date() && issue.status !== 'resolved'
                  return (
                    <tr key={issue.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{issue.id.slice(0, 15)}...</td>
                      <td className="py-3 px-3">{issue.category}</td>
                      <td className="py-3 px-3">{issue.departmentAssigned || '-'}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`${
                            isOverdue
                              ? 'bg-destructive/20 text-destructive border-destructive/50'
                              : issue.status === 'resolved'
                                ? 'bg-success/20 text-success border-success/50'
                                : 'bg-primary/20 text-primary border-primary/50'
                          } border text-xs`}
                        >
                          {isOverdue ? 'Overdue' : issue.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-xs text-muted-foreground">
                        {issue.deadline ? format(issue.deadline, 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="py-3 px-3 text-xs text-muted-foreground">
                        {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
