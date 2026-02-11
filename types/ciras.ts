export type UserRole = 'student' | 'staff' | 'admin'

export type IssueStatus = 'submitted' | 'assigned' | 'in-progress' | 'resolved' | 'overdue'

export type IssueCategory =
  | 'Buildings & Classrooms'
  | 'Electrical & Lighting'
  | 'Water & Sanitation'
  | 'Hostels & Accommodation'
  | 'Furniture & Equipment'
  | 'Security Incidents'
  | 'Fire & Emergency Hazards'
  | 'Health & Medical Services'
  | 'Lectures & Timetabling'
  | 'Examinations & Assessments'
  | 'Lecturers & Teaching Quality'
  | 'Registration & Records'
  | 'Fees & Finance Issues'
  | 'Internet & Network Access'
  | 'Learning Management Systems (LMS)'
  | 'Computer Labs & ICT Support'
  | 'Catering & Food Services'
  | 'Accessibility & Disability Support'
  | 'Transport & Parking'
  | 'Environmental & Cleanliness Issues'
  | 'Other / General Concern'

export const CATEGORY_TO_DEPARTMENT: Record<IssueCategory, string> = {
  'Buildings & Classrooms': 'Estates',
  'Electrical & Lighting': 'Estates',
  'Water & Sanitation': 'Estates',
  'Hostels & Accommodation': 'Student Affairs',
  'Furniture & Equipment': 'Estates',
  'Security Incidents': 'Campus Security',
  'Fire & Emergency Hazards': 'Campus Security',
  'Health & Medical Services': 'Health Services',
  'Lectures & Timetabling': 'Academic Affairs',
  'Examinations & Assessments': 'Academic Affairs',
  'Lecturers & Teaching Quality': 'Academic Affairs',
  'Registration & Records': 'Registrar',
  'Fees & Finance Issues': 'Finance',
  'Internet & Network Access': 'ICT',
  'Learning Management Systems (LMS)': 'ICT',
  'Computer Labs & ICT Support': 'ICT',
  'Catering & Food Services': 'Student Affairs',
  'Accessibility & Disability Support': 'Student Affairs',
  'Transport & Parking': 'Facilities',
  'Environmental & Cleanliness Issues': 'Facilities',
  'Other / General Concern': 'General',
}

export interface Issue {
  id: string
  category: IssueCategory
  location: string
  description: string
  status: IssueStatus
  anonymous: boolean
  studentId?: string
  departmentAssigned?: string
  createdAt: Date
  deadline?: Date
  resolvedAt?: Date
  comments: IssueComment[]
  activityLog: ActivityLog[]
  imageUrl?: string
}

export interface IssueComment {
  id: string
  author: string
  authorRole: UserRole
  content: string
  timestamp: Date
}

export interface ActivityLog {
  id: string
  action: string
  actor: string
  actorRole: UserRole
  timestamp: Date
  details?: string
}

export interface User {
  id: string
  name: string
  role: UserRole
  department?: string
}

export interface DepartmentStats {
  name: string
  totalIssues: number
  resolved: number
  pending: number
  overdue: number
  avgResolutionTime: number
}
