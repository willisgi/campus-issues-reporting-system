'use client'

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  // Demo data provider - no pre-loaded data
  // System starts empty for users to create fresh issues
  return <>{children}</>
}
