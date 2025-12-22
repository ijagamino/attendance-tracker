import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/app/providers/auth-provider'
import type { ReactNode } from 'react'
import type { Role } from '@/supabase/global.types'

export default function ProtectRoute({
  children,
  allowedRole,
}: {
  children: ReactNode
  allowedRole?: Role
}) {
  const { isLoading, isAuth, role } = useAuth()
  const location = useLocation()

  if (isLoading) return null
  if (!isAuth) return <Navigate to="/login" />
  if (allowedRole && role === null) return null
  if (allowedRole && allowedRole !== role) {
    return <Navigate to="/" state={{ from: location.pathname }} />
  }

  return children
}
