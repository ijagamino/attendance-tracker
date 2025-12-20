import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Column } from 'shared/types/api'
import _ from 'lodash'

export function DataTable<
  T extends Record<string, string | number | null | unknown>,
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
              {formattedColumns.map((column) => (
                <TableHead key={column.value}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} onClick={() => onRowClick?.(row)}>
              {columns &&
                formattedColumns.map((column) => (
                  <TableCell key={column.value ?? column.label}>
                    {(() => {
                      const rawValue = column.value
                        ? String(_.get(row, column.value))
                        : undefined

                      if (column.format) {
                        return column.format(rawValue, row)
                      }

                      return rawValue !== null ? String(rawValue) : '-'
                    })()}
                  </TableCell>
                ))}
              {!columns && <TableCell>{Object.values(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
