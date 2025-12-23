import * as xlsx from 'xlsx'

export async function exportXlsx<T>({
  worksheetName,
  columns = [],
  fileName,
  callback
}: {
  worksheetName: string,
  columns?: { label: string, width: number }[],
  fileName: string,
  callback: () => Promise<T[]>
}) {
  const colNames: string[] = []
  const colWidths: number[] = []

  const formattedData = await callback()

  const worksheet = xlsx.utils.aoa_to_sheet([])
  const workbook = xlsx.utils.book_new()

  columns.map(column => {
    colNames.push(column.label)
    colWidths.push(column.width)
  })

  xlsx.utils.sheet_add_aoa(worksheet, [[`Created ${new Date().toISOString()}`]], { origin: 0 })

  if (columns) xlsx.utils.sheet_add_aoa(worksheet, [colNames], { origin: 2 })
  xlsx.utils.sheet_add_json(worksheet, formattedData, { skipHeader: columns.length > 0 ? true : false, origin: 3 })


  xlsx.utils.book_append_sheet(workbook, worksheet, worksheetName)


  worksheet["!cols"] = colWidths.map(width => ({ wch: width }))

  xlsx.writeFile(workbook, `${fileName}.xlsx`)
}
