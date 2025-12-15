import type { RowCount } from 'shared/types/database'

export default function pagination(
  page: string,
  limit: string,
  rows: RowCount[]
) {
  const pageNum: number = Number(page)
  const limitNum: number = Number(limit)
  const offset: number =
    pageNum - 1 > 0 ? Math.ceil((pageNum - 1) * limitNum) : 0

  const totalRows: number = rows.length > 0 ? rows[0].count : 0

  const totalPage: number = Math.ceil(totalRows / limitNum)

  return { pageNum, limitNum, offset, totalPage }
}
