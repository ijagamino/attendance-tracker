import { supabase } from "@/supabase/client"
import type { AttendanceRecord } from "@/supabase/global.types"
import { useCallback, useEffect, useState } from "react"

export default function useUserAttendanceRecords(
  {
    userId,
    page,
    limit
  }: {
    userId: string | undefined,
    page: number,
    limit: number
  }) {
  const [userAttendanceRecords, setUserAttendanceRecords] = useState<
    AttendanceRecord[]
  >([])

  const [totalPage, setTotalPage] = useState<number>()

  const getUserAttendanceRecords = useCallback(
    async (userId: string, {
      page,
      limit,
      sort,
      ascending
    }: {
      page?: number,
      limit?: number,
      sort?: string,
      ascending?: boolean
    } = {}
    ) => {
      const query = supabase
        .from('attendance_records')
        .select('*, profiles!inner(id, first_name)', {
          count: 'exact',
        })

      if (userId) {
        query.eq('profiles.id', userId)
      }

      if (sort) {
        query.order(sort, { ascending })
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

  useEffect(() => {
    if (!userId) return
    getUserAttendanceRecords(userId, { page, limit }).then(({ data, count }) => {
      setUserAttendanceRecords(data)
      setTotalPage(Math.ceil((count ?? 0) / limit))
    })

  }, [getUserAttendanceRecords, userId, page, limit])

  return { userAttendanceRecords, setUserAttendanceRecords, getUserAttendanceRecords, totalPage }
}
