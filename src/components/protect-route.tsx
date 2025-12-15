import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/app/providers/auth-provider'
import type { ReactNode } from 'react'
import type { UserRole } from 'shared/types/api'

export default function ProtectRoute({
  children,
  allowedRole,
}: {
  children: ReactNode
  allowedRole?: UserRole
}) {
  const { isLoading, isAuth, userRole } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!isAuth) return <Navigate to="/login" />

  if (allowedRole) {
    if (allowedRole !== userRole)
      return <Navigate to="/" state={{ from: location.pathname }} />
  }

  return children
}
