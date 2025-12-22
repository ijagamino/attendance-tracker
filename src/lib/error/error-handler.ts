export async function getErrorMessage(error: unknown): Promise<string> {

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
