import PaginationButtons from '@/components/pagination-buttons'
import { Button } from '@/components/ui/button'
import { TypographyH2, TypographyH4 } from '@/components/ui/typography'
import useQueryParam from '@/hooks/use-query-param.ts'
import UserAttendanceRecordTable from '@/pages/users/id/ui/table.tsx'
import { supabase } from '@/supabase/client'
import type { AttendanceRecord, Profile } from '@/supabase/global.types'
import { FileSpreadsheetIcon, Frown } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { UserProfileCard } from './ui/card'
import { formatDateStringToLocaleTime, formatInterval } from '@/lib/format'
import { exportXlsx } from '@/lib/export'

export default function UserIdPage() {
  const [profile, setProfile] = useState<Profile>()
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([])

  const { searchParams, setParam } = useQueryParam({
    page: '1',
    limit: '5',
  })

  const [totalPage, setTotalPage] = useState<number>()

  const getUserAttendanceRecords = useCallback(
    async (userId: string, { page, limit }: { page?: number, limit?: number } = {}) => {
      const query = supabase
        .from('attendance_records')
        .select('*, profiles!inner(user_id, first_name)', {
          count: 'exact',
        })

      if (userId) {
        query.eq('profiles.user_id', userId)
      }

      if (page && limit) {
        const rangeFrom = (page - 1) * limit
        const rangeTo = rangeFrom + limit - 1
        query.range(rangeFrom, rangeTo)
      }

      const { data, count, error } = await query.overrideTypes<Array<{ total_hours: string }>>()
      if (error) throw new Error(error.message)
      return { data, count }

    }, [])

  const [totalRenderedHours, setTotalRenderedHours] = useState<
    string | undefined
  >('')

  const { id } = useParams()

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)

  useEffect(() => {
    async function getUserProfile(userId: string) {
      const { data } = await supabase.from('profiles').select("first_name").eq('user_id', userId).single()

      if (data) setProfile(data)
    }

    async function getTotalRenderedHours(userId: string) {
      const query = supabase
        .from('attendance_records')
        .select('total_hours.sum()')

      if (userId) {
        query.eq('user_id', userId)
      }

      const { data, error } = await query.single()
      if (error) throw new Error(error.message)

      if (data) {
        const formattedTime = data.sum.toString().split('.')[0]
        setTotalRenderedHours(formattedTime)
      }
    }

    if (!id) return

    getUserProfile(id)
    getTotalRenderedHours(id)
  }, [id])

  useEffect(() => {
    if (!id) return
    getUserAttendanceRecords(id, { page, limit }).then(({ data, count }) => {
      setAttendanceRecords(data)
      setTotalPage(Math.ceil((count ?? 0) / limit))
    })
  }, [getUserAttendanceRecords, id, page, limit])

  const [hours, minutes, seconds] = totalRenderedHours?.split(':') ?? []

  async function handleExport() {
    exportXlsx<{
      name: string
      date: string | null
      timeIn: string
      timeOut: string
      totalHours: string
    }>({
      worksheetName: "Attendance records",
      columns: [
        { label: 'Name', width: 20 },
        { label: 'Date', width: 15 },
        { label: 'Time In', width: 15 },
        { label: 'Time Out', width: 15 },
        { label: 'Total Hours', width: 10 }
      ],
      fileName: `${profile ? profile.first_name : ''}-attendance-records`,
      callback: async () => {
        if (!id) return []

        const { data } = await getUserAttendanceRecords(id)

        if (!data) return []

        return data.map((attendanceRecord) => ({
          name: attendanceRecord.profiles.first_name,
          date: attendanceRecord.date,
          timeIn: attendanceRecord.time_in ? formatDateStringToLocaleTime(attendanceRecord.time_in) : '',
          timeOut: attendanceRecord.time_out ? formatDateStringToLocaleTime(attendanceRecord.time_out) : '',
          totalHours: formatInterval(attendanceRecord.total_hours)
        }))
      }
    })

  }

  return (
    <>
      <TypographyH2>{profile?.first_name}'s attendance records</TypographyH2>
      <div className="grid my-2 max-w-72">
        <UserProfileCard title="Total hours rendered this month">
          {!hours && !minutes && !seconds ? (
            <Frown className="mx-auto" size={64} />
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="col-span-1 row-span-2 font-extrabold text-7xl">
                {hours}H
              </span>
              <div className="flex flex-col">
                <span className="col-span-1 text-2xl font-bold text-center">
                  {minutes}M
                </span>
                <span className="col-span-1 text-2xl">{seconds}S</span>
              </div>
            </div>
          )}
        </UserProfileCard>
      </div>

      <div className='px-2 py-4 flex justify-between items-center'>
        <TypographyH4>Attendance Records</TypographyH4>
        <Button onClick={() => {
          handleExport()
        }}>
          <FileSpreadsheetIcon />
          Export XLSX
        </Button>
      </div>

      <UserAttendanceRecordTable attendanceRecords={attendanceRecords} />

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
