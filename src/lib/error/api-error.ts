export class ApiError extends Error {
  status: number
  response: Response

  constructor(status: number, response: Response) {
    super(`HTTP ${status}`)
    this.status = status
    this.response = response
  }

  async json<T>(): Promise<T> {
    return this.response.json()
  }
}
