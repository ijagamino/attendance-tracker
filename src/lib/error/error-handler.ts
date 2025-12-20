import { ApiError } from '@/lib/error/api-error.ts'

interface ApiErrorResponse {
  error: {
    code: number
    message: string
  }
}

export async function getErrorMessage(error: unknown): Promise<string> {
  if (error instanceof ApiError) {
    const errorData = await error.json<ApiErrorResponse>()
    return errorData?.error?.message || 'An error occurred'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
