'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCiras } from '@/contexts/ciras-context'
import { CATEGORY_TO_DEPARTMENT } from '@/types/ciras'
import { AlertCircle, CheckCircle } from 'lucide-react'

const CATEGORIES = [
  'Buildings & Lecture halls',
  'Electrical & Lighting',
  'Water & Sanitation',
  'Hostels & Accommodation',
  'Furniture & Equipment',
  'Security Incidents',
  'Fire & Emergency Hazards',
  'Health & Medical Services',
  'Lectures & Timetabling',
  'Examinations & Assessments',
  'Lecturers & Teaching Quality',
  'Registration & Records',
  'Fees & Finance Issues',
  'Internet & Network Access',
  'Learning Management Systems (LMS)',
  'Computer Labs & ICT Support',
  'Catering & Food Services',
  'Accessibility & Disability Support',
  'Transport & Parking',
  'Environmental & Cleanliness Issues',
  'Other / General Concern',
] as const

export function ReportForm() {
  const router = useRouter()
  const { addIssue, setCurrentUser } = useCiras()

  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
    anonymous: false,
    studentName: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [issueName, setIssueName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Set current user as student
    setCurrentUser({
      id: `student-${Date.now()}`,
      name: formData.studentName || 'Anonymous Student',
      role: 'student',
    })

    // Create issue
    const newIssue = addIssue({
      category: formData.category as any,
      location: formData.location,
      description: formData.description,
      anonymous: formData.anonymous,
      studentId: formData.studentName ? `student-${formData.studentName}` : undefined,
      status: 'submitted',
    })

    setIssueName(newIssue.id)
    setSubmitted(true)

    // Reset form
    setFormData({
      category: '',
      location: '',
      description: '',
      anonymous: false,
      studentName: '',
    })
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-green-500/10 to-accent/5 border-green-500/50">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Issue Submitted Successfully</h3>
            <p className="text-muted-foreground">Your campus issue has been recorded and assigned for review.</p>
          </div>

          <div className="w-full bg-gradient-to-br from-green-500/20 to-accent/10 border border-green-500/30 rounded-lg p-6 text-left space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Issue ID</p>
              <p className="text-lg font-mono font-semibold text-foreground">{issueName}</p>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Use this ID to track your issue status. You can reference it if you need to add more information.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <Button
              onClick={() => {
                setSubmitted(false)
              }}
              className="flex-1"
            >
              Submit Another Issue
            </Button>
            <Button onClick={() => router.push('/track')} variant="outline" className="flex-1">
              Track This Issue
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto p-8 bg-card border-border">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Report a Campus Issue</h2>
          <p className="text-muted-foreground">
            Help us improve campus life by reporting concerns. Your feedback is valuable and will be handled with care.
          </p>
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
          <div>
            <Label className="text-foreground font-semibold">Report Anonymously</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Keep your identity private when reporting this issue
            </p>
          </div>
          <Switch
            checked={formData.anonymous}
            onCheckedChange={(checked) => setFormData({ ...formData, anonymous: checked })}
          />
        </div>

        {/* Name Field (if not anonymous) */}
        {!formData.anonymous && (
          <div>
            <Label htmlFor="name" className="text-foreground font-semibold">
              Your Name (Optional)
            </Label>
            <Input
              id="name"
              placeholder="Enter your name for follow-up contact"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="mt-2 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        )}

        {/* Category */}
        <div>
          <Label htmlFor="category" className="text-foreground font-semibold">
            Issue Category <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger id="category" className="mt-2 bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-foreground">
                  <div className="flex flex-col">
                    <span>{cat}</span>
                    <span className="text-xs text-muted-foreground">→ {CATEGORY_TO_DEPARTMENT[cat]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.category && (
            <p className="text-sm text-muted-foreground mt-2">
              This will be assigned to: <span className="text-primary font-semibold">{CATEGORY_TO_DEPARTMENT[formData.category as any]}</span>
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-foreground font-semibold">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            placeholder="e.g., Building A, Room 210 or Campus Grounds"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-2 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-foreground font-semibold">
            Issue Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Provide detailed information about the issue..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-2 bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-32"
            required
          />
        </div>

        {/* Info Box */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <p className="font-semibold mb-1">What happens next?</p>
            <p className="text-muted-foreground">
              Your issue will be reviewed and assigned to the appropriate department within 24 hours. You'll receive a
              unique tracking ID to monitor progress.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!formData.category || !formData.location || !formData.description}
          size="lg"
          className="w-full"
        >
          Submit Issue Report
        </Button>
      </form>
    </Card>
  )
}
