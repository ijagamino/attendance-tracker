import type { ReactNode } from "react"

export interface Column<T> {
  label: string
  value?: string
  format?: (value: unknown, row: T) => ReactNode
  Cell?: (row: T, value?: unknown) => ReactNode
  visibility?: boolean
}
