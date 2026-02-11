'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCiras } from '@/contexts/ciras-context'
import { Issue, IssueStatus } from '@/types/ciras'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

export function DepartmentDashboard() {
  const { issues, updateIssueStatus, addComment, currentUser } = useCiras()
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [commentText, setCommentText] = useState('')

  const selectedDept = currentUser?.department || 'Unknown'
  const deptIssues = issues.filter((issue) => issue.departmentAssigned === selectedDept)

  const stats = {
    total: deptIssues.length,
    resolved: deptIssues.filter((i) => i.status === 'resolved').length,
    pending: deptIssues.filter((i) => i.status !== 'resolved').length,
    overdue: deptIssues.filter((i) => i.deadline && i.deadline < new Date() && i.status !== 'resolved').length,
  }

  const handleStatusChange = (issue: Issue, newStatus: IssueStatus) => {
    if (!currentUser) return
    updateIssueStatus(issue.id, newStatus, currentUser)
  }

  const handleAddComment = (issue: Issue) => {
    if (!commentText.trim() || !currentUser) return

    addComment(issue.id, {
      author: currentUser.name,
      authorRole: currentUser.role,
      content: commentText,
    })

    setCommentText('')
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
          <p className="text-3xl font-bold text-primary">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-3xl font-bold text-success">{stats.resolved}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-3xl font-bold text-primary">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-3xl font-bold text-destructive">{stats.overdue}</p>
        </Card>
      </div>

      {/* Issues Table */}
      <Card className="p-6 bg-card border-border overflow-hidden">
        <h3 className="text-lg font-bold text-foreground mb-4">{selectedDept} Issues</h3>

        {deptIssues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No issues assigned to {selectedDept} yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Issue ID</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Location</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Deadline</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {deptIssues.map((issue) => {
                  const isOverdue = issue.deadline && issue.deadline < new Date() && issue.status !== 'resolved'
                  return (
                    <tr
                      key={issue.id}
                      className={`border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors ${
                        selectedIssue?.id === issue.id ? 'bg-secondary/50' : ''
                      }`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{issue.id.slice(0, 20)}...</td>
                      <td className="py-3 px-3">{issue.category}</td>
                      <td className="py-3 px-3 text-muted-foreground">{issue.location}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`${
                            isOverdue
                              ? 'bg-destructive/20 text-destructive border-destructive/50'
                              : issue.status === 'resolved'
                                ? 'bg-success/20 text-success border-success/50'
                                : 'bg-primary/20 text-primary border-primary/50'
                          } border`}
                        >
                          {isOverdue ? 'Overdue' : issue.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">
                        {issue.deadline
                          ? `${format(issue.deadline, 'MMM dd')}`
                          : 'Not set'
                        }
                      </td>
                      <td className="py-3 px-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedIssue(issue)
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Issue Detail Panel */}
      {selectedIssue && (
        <Card className="p-6 bg-card border-border">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">{selectedIssue.id}</h3>
              <Button size="sm" variant="outline" onClick={() => setSelectedIssue(null)}>
                Close
              </Button>
            </div>

            {/* Issue Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-semibold text-foreground">{selectedIssue.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-foreground">{selectedIssue.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-semibold text-foreground capitalize">{selectedIssue.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                <p className="font-semibold text-foreground">{format(selectedIssue.createdAt, 'MMM dd, yyyy hh:mm')}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-foreground bg-secondary p-3 rounded-lg">{selectedIssue.description}</p>
            </div>

            {/* Status Update */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Update Status</Label>
              <Select
                value={selectedIssue.status}
                onValueChange={(newStatus) => {
                  handleStatusChange(selectedIssue, newStatus as IssueStatus)
                  setSelectedIssue({ ...selectedIssue, status: newStatus as IssueStatus })
                }}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Comment */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Add Resolution Comment</Label>
              <Textarea
                placeholder="Provide an update on the issue resolution..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={() => handleAddComment(selectedIssue)}
                disabled={!commentText.trim()}
              >
                Add Comment
              </Button>
            </div>

            {/* Comments */}
            {selectedIssue.comments.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Comments ({selectedIssue.comments.length})</p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedIssue.comments.map((comment) => (
                    <div key={comment.id} className="bg-secondary p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          {comment.author} • {comment.authorRole}
                        </p>
                        <p className="text-xs text-muted-foreground">{format(comment.timestamp, 'MMM dd, hh:mm')}</p>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Log */}
            {selectedIssue.activityLog.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Activity Log</p>
                <div className="space-y-2 text-xs">
                  {selectedIssue.activityLog.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">•</span>
                      <span>
                        <span className="font-semibold">{log.actor}</span> {log.action} •{' '}
                        {format(log.timestamp, 'MMM dd, hh:mm')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
