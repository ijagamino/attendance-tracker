import { useEffect, useState } from 'react'
import type { AttendanceRecord } from '@/supabase/global.types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import DatePicker from '@/components/date-picker'
import AttendanceRecordTable from './ui/table'
import { TypographyH1 } from '@/components/ui/typography'
import PaginationButtons from '@/components/pagination-buttons'
import useQueryParam from '@/hooks/use-query-param'
import { supabase } from '@/supabase/client'

export default function RecordsPage() {
  const { searchParams, setParam } = useQueryParam({
    name: '',
    date: '',
    page: '1',
    limit: '5',
  })

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([])

  const [totalPage, setTotalPage] = useState<number>()

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)
  const name = searchParams.get('name') ?? ''
  const date = searchParams.get('date') ?? ''

  useEffect(() => {
    async function fetchAttendanceRecords() {
      const rangeFrom = (page - 1) * limit
      const rangeTo = rangeFrom + limit - 1

      const query = supabase
        .from('attendance_records')
        .select('*, profiles!inner(first_name)', { count: 'exact' })

      if (name) query.ilike('profiles.first_name', `%${name}%`)
      if (date) query.eq('date', date)

      query.range(rangeFrom, rangeTo)

      const { data, count, error } = await query
      if (error) throw error

      setAttendanceRecords(data)
      setTotalPage(Math.ceil((count ?? 0) / limit))
    }

    fetchAttendanceRecords()
  }, [limit, name, page, date])

  return (
    <>
      <header>
        <TypographyH1>Attendance Records</TypographyH1>
      </header>

      <div className="flex justify-between mb-2 space-x-2">
        <div className="flex-1 max-w-sm space-y-1">
          <Label htmlFor="name">Search name</Label>
          <Input
            id="name"
            placeholder="Search by name..."
            onChange={(event) => {
              setParam('name', event.target.value)
            }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="date">Filter by date</Label>
          <DatePicker
            onSelectDate={(selectedDate) => {
              if (selectedDate) {
                setParam('date', format(selectedDate, 'yyyy-MM-dd'))
              }
            }}
          />
        </div>
      </div>

      <AttendanceRecordTable attendanceRecords={attendanceRecords} />

      <PaginationButtons
        page={page}
        totalPage={totalPage}
        onPageChange={(newPage) => {
          setParam('page', newPage.toString())
        }}
      />
    </>
  )
}
