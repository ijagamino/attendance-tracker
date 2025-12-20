import { Navigate } from 'react-router'
import { useAuth } from '@/app/providers/auth-provider'
import type { ReactNode } from 'react'

export default function LoginRouteWrapper({
  children,
}: {
  children: ReactNode
}) {
  const { isLoading, isAuth } = useAuth()

  if (isLoading) return null
  if (isAuth) return <Navigate to="/" />

  return children
}
