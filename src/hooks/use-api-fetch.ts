import { useAuth } from '@/app/providers/auth-provider.tsx'
import type { HttpMethod } from '@/lib/api/api-client.ts'
import { apiClient } from '@/lib/api/api-client.ts'
import { ApiError } from '@/lib/api/api-error.ts'
import { useCallback } from 'react'

export function useApiFetch() {
  const { accessToken, setAccessToken } = useAuth()

  return useCallback(
    async function apiFetch<T>(
      url: RequestInfo | URL,
      method: HttpMethod,
      options?: RequestInit & {
        searchParams?: URLSearchParams
      },
      retry: boolean = true
    ): Promise<T> {
      try {
        const response = await apiClient(url, method, {
          ...options,
          headers: {
            ...options?.headers,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        })
        return (await response.json()) as T
      } catch (error) {
        if (error instanceof ApiError && error.status === 401 && retry) {
          try {
            const response = await apiClient('auth/refresh', 'POST')

            const { newAccessToken } = await response.json()
            setAccessToken(newAccessToken)

            return apiFetch(url, method, options, false)
          } catch (refreshError) {
            setAccessToken(null)
            throw refreshError
          }
        }
        throw error
      }
    },
    [accessToken, setAccessToken]
  )
}
