'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCiras } from '@/contexts/ciras-context'
import { AlertCircle } from 'lucide-react'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

const STAFF_CREDENTIALS = [
  { username: 'staff1', password: 'staff123', department: 'Estates' },
  { username: 'staff2', password: 'staff123', department: 'Academic Affairs' },
  { username: 'staff3', password: 'staff123', department: 'Campus Security' },
  { username: 'staff4', password: 'staff123', department: 'Student Affairs' },
  { username: 'staff5', password: 'staff123', department: 'ICT' },
]

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setCurrentUser } = useCiras()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Check admin credentials
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
          id: 'admin-1',
          name: 'System Administrator',
          role: 'admin' as const,
        }
        setCurrentUser(adminUser)
        router.push('/dashboard/admin')
        return
      }

      // Check staff credentials
      const staffUser = STAFF_CREDENTIALS.find(
        (staff) => staff.username === username && staff.password === password
      )

      if (staffUser) {
        const user = {
          id: `staff-${staffUser.username}`,
          name: `Staff - ${staffUser.department}`,
          role: 'staff' as const,
          department: staffUser.department,
        }
        setCurrentUser(user)
        router.push('/dashboard/staff')
        return
      }

      setError('Invalid username or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/ciras-logo.jpg" alt="CIRAS" width={56} height={56} className="rounded-lg" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CIRAS
          </h1>
          <p className="text-muted-foreground text-sm">
            Staff & Administrator Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-card/40 backdrop-blur border-border/50">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-semibold">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                autoComplete="current-password"
              />
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}




        
        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
