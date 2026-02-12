import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card } from '@/components/ui/card'
import { Issue } from '@/types/ciras'

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316']

interface TrackingAnalyticsProps {
  issues: Issue[]
}

export function TrackingAnalytics({ issues }: TrackingAnalyticsProps) {
  // Memoize expensive calculations
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>()
    issues.forEach((issue) => {
      categoryMap.set(issue.category, (categoryMap.get(issue.category) || 0) + 1)
    })
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ category: name.substring(0, 20), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [issues])

  const statusData = useMemo(() => {
    const statusMap = new Map<string, number>()
    issues.forEach((issue) => {
      statusMap.set(issue.status, (statusMap.get(issue.status) || 0) + 1)
    })
    return Array.from(statusMap.entries()).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }))
  }, [issues])

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
        <h3 className="font-bold text-lg text-foreground mb-4">Most Recurrent Issues</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
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
              />
              <Bar dataKey="count" fill="#3B82F6" name="Reported" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground py-8">No data available yet</p>
        )}
      </Card>

      <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
        <h3 className="font-bold text-lg text-foreground mb-4">Status Distribution</h3>
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
    </div>
  )
}
