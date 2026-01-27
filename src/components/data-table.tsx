import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Column } from '@/shared/types'
import _ from 'lodash'
import type { Key } from 'react'

export function DataTable<
  T extends Record<string, string | number | boolean | object | null>,
>({
  columns,
  rows,
  onRowClick,
}: {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
}) {
  function formatColumns() {
    return columns.map((column) => {
      const columnHasValue = Object.hasOwn(column, 'value')

      if (columnHasValue) return column

      return {
        ...column,
        value: _.snakeCase(column.label),
      }
    })
  }
  const formattedColumns = formatColumns()

  return (
    <div className="rounded-md border">
      <Table>
        {columns && (
          <TableHeader>
            <TableRow>
              {formattedColumns
                .filter((column) => {
                  if (column.visibility === undefined || column.visibility === null) {
                    return column
                  }

                  return column.visibility
                })
                .map((column) => (
                  <TableHead key={column.value} className='text-primary'>{column.label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id as Key} onClick={() => onRowClick?.(row)}>
              {columns &&
                formattedColumns.
                  filter((column) => {
                    if (column.visibility === undefined || column.visibility === null) {
                      return column
                    }

                    return column.visibility
                  })
                  .map((column) => (
                    <TableCell key={column.value ?? column.label}>
                      {(() => {
                        const rawValue = column.value
                          ? _.get(row, column.value)
                          : undefined
                        if (column.Cell) {
                          return column.Cell(row, rawValue)
                        }

                        if (column.format) {
                          return column.format(rawValue, row)
                        }

                        if (rawValue === undefined || rawValue === null) return '---'

                        return rawValue.toString()
                      })()}
                    </TableCell>
                  ))}
              {!columns && <TableCell>{Object.values(row) as unknown as string}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
