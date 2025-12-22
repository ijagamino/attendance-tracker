import { TypographyH2 } from '@/components/ui/typography'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import PaginationButtons from '@/components/pagination-buttons'
import { UserProfileCard } from './ui/card'
import { Frown } from 'lucide-react'
import useQueryParam from '@/hooks/use-query-param.ts'
import UserAttendanceRecordTable from '@/pages/users/id/ui/table.tsx'
import { supabase } from '@/supabase/client'
import type { AttendanceRecord, Profile } from '@/supabase/global.types'

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

  const [totalRenderedHours, setTotalRenderedHours] = useState<
    string | undefined
  >('')

  const { id } = useParams()

  const page = Number(searchParams.get('page') ?? 1)
  const name = searchParams.get('name') ?? ''
  const limit = Number(searchParams.get('limit') ?? 5)

  useEffect(() => {
    async function getUserProfile(userId: string) {
      const { data } = await supabase.from('profiles').select("first_name").eq('user_id', userId).single()

      if (data) setProfile(data)
    }

    async function getUserAttendanceRecords(userId: string) {
      const rangeFrom = (page - 1) * limit
      const rangeTo = rangeFrom + limit - 1

      const query = supabase
        .from('attendance_records')
        .select('*, profiles!inner(user_id, first_name)', {
          count: 'exact',
        })

      if (userId) {
        query.eq('profiles.user_id', userId)
      }

      query.range(rangeFrom, rangeTo)

      const { data, count, error } = await query
      if (error) throw new Error(error.message)

      setAttendanceRecords(data)
      setTotalPage(Math.ceil((count ?? 0) / limit))
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

    if (id) {
      getUserProfile(id)
      getUserAttendanceRecords(id)
      getTotalRenderedHours(id)
    }
  }, [id, limit, name, page])

  const [hours, minutes, seconds] = totalRenderedHours?.split(':') ?? []

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
