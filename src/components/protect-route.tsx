import { Navigate } from 'react-router'
import { useAuth } from '@/app/providers/auth-provider'
import type { ReactNode } from 'react'

export default function ProtectRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuth } = useAuth()

  if (isLoading) return null

  if (!isAuth) return <Navigate to="/login" />

  return children
}
