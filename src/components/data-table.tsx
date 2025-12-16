import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Column, Entity } from 'shared/types/api'
import _ from 'lodash'

export function DataTable<T extends Entity>({
  columns,
  rows,
  onRowClick,
}: {
  columns: Column[]
  rows: T[]
  onRowClick?: (row: T) => void
}) {
  function formatColumns() {
    return columns.map((column) => {
      const columnHasValue = Object.hasOwn(column, 'value')

      if (columnHasValue) return column

      return {
        ...column,
        value: _.camelCase(column.label),
      }
    })
  }
  const formattedColumns: Column[] = formatColumns()

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
                    {column.value ? (row[column.value] ?? '-') : '-'}
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
