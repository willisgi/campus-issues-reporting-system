'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCiras } from '@/contexts/ciras-context'
import { ArrowLeft, LogOut } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function MonitoringPage() {
  const { currentUser, logout, issues, isLoading } = useCiras()
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

  // Calculate recurrent issues by category
  const categoryMap = new Map<string, number>()
  issues.forEach((issue) => {
    categoryMap.set(issue.category, (categoryMap.get(issue.category) || 0) + 1)
  })
  const recurrentByCategory = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ category: name.substring(0, 20), count, fullName: name }))
    .sort((a, b) => b.count - a.count)

  // Calculate by location
  const locationMap = new Map<string, number>()
  issues.forEach((issue) => {
    locationMap.set(issue.location, (locationMap.get(issue.location) || 0) + 1)
  })
  const recurrentByLocation = Array.from(locationMap.entries())
    .map(([name, count]) => ({ location: name.substring(0, 25), count, fullName: name }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Status distribution
  const statusMap = new Map<string, number>()
  issues.forEach((issue) => {
    statusMap.set(issue.status, (statusMap.get(issue.status) || 0) + 1)
  })
  const statusData = Array.from(statusMap.entries()).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }))

  // Issues over time (daily)
  const dateMap = new Map<string, number>()
  issues.forEach((issue) => {
    const date = issue.createdAt.toISOString().split('T')[0]
    dateMap.set(date, (dateMap.get(date) || 0) + 1)
  })
  const timelineData = Array.from(dateMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      issues: count,
    }))

  // Department breakdown
  const deptMap = new Map<string, number>()
  issues.forEach((issue) => {
    if (issue.departmentAssigned) {
      deptMap.set(issue.departmentAssigned, (deptMap.get(issue.departmentAssigned) || 0) + 1)
    }
  })
  const departmentData = Array.from(deptMap.entries())
    .map(([dept, count]) => ({ name: dept.substring(0, 15), value: count, fullName: dept }))
    .sort((a, b) => b.value - a.value)

  // Color palette
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316']

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Back</span>
            </Link>
            <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time system metrics and recurrent issues</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className="text-3xl font-bold text-primary">{issues.length}</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Most Common Category</p>
                <p className="text-sm font-bold text-accent truncate">
                  {recurrentByCategory.length > 0 ? recurrentByCategory[0].fullName : 'N/A'}
                </p>
                <p className="text-2xl font-bold text-accent">
                  {recurrentByCategory.length > 0 ? recurrentByCategory[0].count : 0}
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Most Affected Location</p>
                <p className="text-sm font-bold text-warning truncate">
                  {recurrentByLocation.length > 0 ? recurrentByLocation[0].fullName : 'N/A'}
                </p>
                <p className="text-2xl font-bold text-warning">
                  {recurrentByLocation.length > 0 ? recurrentByLocation[0].count : 0}
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold text-accent">
                  {issues.length > 0 ? Math.round((issues.filter((i) => i.status === 'resolved').length / issues.length) * 100) : 0}%
                </p>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Issues by Category */}
            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <h3 className="font-bold text-lg text-foreground mb-4">Recurrent Issues by Category</h3>
              {recurrentByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recurrentByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="category" stroke="#888" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#888' }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" name="Issues" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </Card>

            {/* Issues by Location */}
            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <h3 className="font-bold text-lg text-foreground mb-4">Top Affected Locations</h3>
              {recurrentByLocation.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recurrentByLocation} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#888" />
                    <YAxis dataKey="location" type="category" width={120} stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#888' }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" name="Issues" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </Card>
          </div>

          {/* More Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <h3 className="font-bold text-lg text-foreground mb-4">Issue Status Distribution</h3>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </Card>

            {/* Issues Timeline */}
            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <h3 className="font-bold text-lg text-foreground mb-4">Issues Over Time</h3>
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid #444',
                        color: '#fff',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="issues" stroke="#10B981" strokeWidth={2} name="Issues" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </Card>
          </div>

          {/* Department Breakdown */}
          {departmentData.length > 0 && (
            <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
              <h3 className="font-bold text-lg text-foreground mb-4">Issues by Department</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentData.map((dept, idx) => (
                  <Card key={dept.fullName} className="p-4 bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{dept.fullName}</p>
                        <p className="text-2xl font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                          {dept.value}
                        </p>
                      </div>
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] + '20' }}
                      >
                        <span className="text-lg font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                          {Math.round((dept.value / issues.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Issues Table */}
          <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
            <h3 className="font-bold text-lg text-foreground mb-4">Recent Issues</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Issue ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Category</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Department</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.slice(0, 10).map((issue) => (
                    <tr key={issue.id} className="border-b border-border/30 hover:bg-secondary/30">
                      <td className="py-3 px-2 text-foreground font-mono text-xs">{issue.id.slice(0, 8)}</td>
                      <td className="py-3 px-2 text-muted-foreground">{issue.category}</td>
                      <td className="py-3 px-2 text-muted-foreground">{issue.departmentAssigned || 'Unassigned'}</td>
                      <td className="py-3 px-2">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor:
                              issue.status === 'resolved'
                                ? '#10B98133'
                                : issue.status === 'overdue'
                                  ? '#EF444433'
                                  : '#3B82F633',
                            color:
                              issue.status === 'resolved'
                                ? '#10B981'
                                : issue.status === 'overdue'
                                  ? '#EF4444'
                                  : '#3B82F6',
                          }}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {issue.createdAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
