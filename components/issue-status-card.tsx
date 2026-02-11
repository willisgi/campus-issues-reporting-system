'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Issue } from '@/types/ciras'
import { format } from 'date-fns'
import { Calendar, MapPin, User, Clock, MessageSquare } from 'lucide-react'

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', bg: 'bg-muted/30', text: 'text-muted-foreground', border: 'border-muted/50' },
  assigned: { label: 'Assigned', bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  'in-progress': { label: 'In Progress', bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/50' },
  resolved: { label: 'Resolved', bg: 'bg-success/20', text: 'text-success', border: 'border-success/50' },
  overdue: { label: 'Overdue', bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/50' },
}

const CATEGORY_COLORS = {
  Facilities: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  Safety: 'bg-red-500/10 text-red-300 border-red-500/30',
  Academics: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  Welfare: 'bg-green-500/10 text-green-300 border-green-500/30',
  Other: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
}

export function IssueStatusCard({ issue }: { issue: Issue }) {
  const config = STATUS_CONFIG[issue.status]
  const now = new Date()
  let displayStatus = issue.status

  // Check if overdue
  if (issue.deadline && issue.deadline < now && issue.status !== 'resolved') {
    displayStatus = 'overdue'
  }

  const statusConfig = STATUS_CONFIG[displayStatus]

  return (
    <Card className={`p-6 bg-card/40 backdrop-blur border ${statusConfig.border} hover:bg-card/60 transition-all`}>
      <div className="space-y-4">
        {/* Header with ID and Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">Issue ID</p>
            <p className="text-lg font-mono font-bold text-foreground">{issue.id}</p>
          </div>
          <Badge className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} whitespace-nowrap`}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Category and Location */}
        <div className="flex flex-wrap gap-3">
          <Badge
            className={`${CATEGORY_COLORS[issue.category as keyof typeof CATEGORY_COLORS]} border text-xs`}
          >
            {issue.category}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {issue.location}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-foreground line-clamp-3">{issue.description}</p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Submitted: {format(issue.createdAt, 'MMM dd, yyyy')}</span>
          </div>
          {issue.departmentAssigned && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{issue.departmentAssigned}</span>
            </div>
          )}
          {issue.deadline && (
            <div className={`flex items-center gap-2 ${issue.deadline < now ? 'text-destructive' : 'text-muted-foreground'}`}>
              <Clock className="w-4 h-4" />
              <span>Deadline: {format(issue.deadline, 'MMM dd, yyyy')}</span>
            </div>
          )}
          {issue.comments.length > 0 && (
            <div className="flex items-center gap-2 text-primary">
              <MessageSquare className="w-4 h-4" />
              <span>{issue.comments.length} update(s)</span>
            </div>
          )}
        </div>

        {/* Progress Timeline */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2">
            {['submitted', 'assigned', 'in-progress', 'resolved'].map((step, idx) => {
              const isActive = ['submitted', 'assigned', 'in-progress', 'resolved'].indexOf(displayStatus) >= idx
              return (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-muted/50'}`}
                  />
                  {idx < 3 && <div className={`h-0.5 flex-1 ${isActive ? 'bg-primary' : 'bg-muted/50'}`} />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
