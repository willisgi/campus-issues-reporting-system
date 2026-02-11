import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Issue } from '@/types/ciras'

interface IssuesTableProps {
  issues: Issue[]
  searchId: string
  filterDept: string
  filterStatus: string
  onClearFilters: () => void
}

export function IssuesTable({
  issues,
  searchId,
  filterDept,
  filterStatus,
  onClearFilters,
}: IssuesTableProps) {
  const filteredIssues = useMemo(() => {
    let result = issues

    if (searchId) {
      result = result.filter((issue) => issue.id.includes(searchId))
    }
    if (filterDept !== 'all') {
      result = result.filter((issue) => issue.departmentAssigned === filterDept)
    }
    if (filterStatus !== 'all') {
      result = result.filter((issue) => issue.status === filterStatus)
    }

    return result
  }, [issues, searchId, filterDept, filterStatus])

  return (
    <Card className="p-6 bg-card/40 backdrop-blur border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-foreground">
          All Reported Issues ({filteredIssues.length})
        </h3>
        {filteredIssues.length === 0 && issues.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredIssues.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Issue ID</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Category</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Location</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Department</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Status</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-2 text-foreground font-mono text-xs">{issue.id.substring(0, 8)}</td>
                  <td className="py-3 px-2 text-muted-foreground">{issue.category}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs truncate max-w-xs">{issue.location}</td>
                  <td className="py-3 px-2 text-muted-foreground">{issue.departmentAssigned || '—'}</td>
                  <td className="py-3 px-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          issue.status === 'resolved'
                            ? '#10B98133'
                            : issue.status === 'overdue'
                              ? '#EF444433'
                              : issue.status === 'in-progress'
                                ? '#F59E0B33'
                                : '#3B82F633',
                        color:
                          issue.status === 'resolved'
                            ? '#10B981'
                            : issue.status === 'overdue'
                              ? '#EF4444'
                              : issue.status === 'in-progress'
                                ? '#F59E0B'
                                : '#3B82F6',
                      }}
                    >
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">
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
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchId || filterDept !== 'all' || filterStatus !== 'all'
              ? 'No issues match your filters'
              : 'No issues reported yet'}
          </p>
        </div>
      )}
    </Card>
  )
}
