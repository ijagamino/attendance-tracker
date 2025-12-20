import { ApiError } from '@/lib/error/api-error.ts'

const baseUrl = 'http://localhost:3000/api'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function apiClient(
  url: RequestInfo | URL,
  method: HttpMethod,
  options?: RequestInit & {
    searchParams?: URLSearchParams
  }
): Promise<Response> {
  let fullUrl = `${baseUrl}/${url}`

  if (options?.searchParams) {
    const params = new URLSearchParams(options.searchParams)
    fullUrl += `?${params.toString()}`
  }

  const response = await fetch(fullUrl, {
    ...options,
    method,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
    credentials: 'include',
    mode: 'cors',
  })

  if (!response.ok) {
    throw new ApiError(response.status, response)
  }

  return response
}
