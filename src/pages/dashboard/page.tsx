import PaginationButtons from '@/components/pagination-buttons.tsx'
import { Separator } from '@/components/ui/separator'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import useQueryParam from '@/hooks/use-query-param.ts'
import { formatDateStringToLocaleTime } from '@/lib/format'
import { supabase } from '@/supabase/client'
import type { DashboardDailySummary, DashboardUserSummary } from '@/supabase/global.types'
import { useEffect, useState } from 'react'
import DashboardCard from './ui/card'
import DashboardUserTable from './ui/table'

export default function DashboardPage() {
  const { searchParams, setParam } = useQueryParam({
    name: '',
    page: '1',
    limit: '5',
  })

  const [dashboardUserSummary, setDashboardUserSummary] = useState<DashboardUserSummary>()
  const [dashboardDailySummary, setDashboardDailySummary] = useState<DashboardDailySummary>()
  const [totalPage, setTotalPage] = useState<number>()

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)
  const name = searchParams.get('name') ?? ''

  useEffect(() => {
    async function fetchDashboard() {
      const rangeFrom = (page - 1) * limit
      const rangeTo = rangeFrom + limit - 1

      const [date] = new Date().toISOString().split('T')

      const { data: earliestTimeIn, count: attendees } = await supabase
        .from('attendance_records')
        .select('time_in.min()', { count: 'exact' })
        .eq('date', date)
      const { count: lateAttendees } = await supabase
        .from('attendance_records')
        .select('*', { count: 'exact' })
        .eq('date', date)
        .eq('status', 'Late')

      const query = supabase
        .from('dashboard_user_summary')
        .select('*', { count: 'exact' })

      if (name) query.ilike('profiles.first_name', `%${name}%`)

      query.range(rangeFrom, rangeTo)

      const { data: dashboardUserSummary, count, error } = await query.overrideTypes<Array<{ total_rendered_hours: string }>>()
      if (error) throw error

      if (dashboardUserSummary) {
        setDashboardUserSummary({ users: dashboardUserSummary })
      }

      if (
        earliestTimeIn && attendees
      ) {
        setDashboardDailySummary({
          attendees,
          lateAttendees,
          earliestTimeIn: earliestTimeIn[0].min,
        })
      }

      setTotalPage(Math.ceil((count ?? 0) / limit))
    }


    fetchDashboard()
  }, [limit, name, page])



  return (
    <>
      <header>
        <TypographyH1>Dashboard</TypographyH1>
      </header>

      <TypographyH2>Daily summary</TypographyH2>

      {dashboardDailySummary ? (
        <div className="grid my-8 grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard title="Attendees">
            <p className="font-extrabold text-center text-6xl">
              {dashboardDailySummary?.attendees}
            </p>
          </DashboardCard>

          <DashboardCard title="Late Attendees">
            <p className="font-extrabold text-center text-6xl">
              {dashboardDailySummary?.lateAttendees}
            </p>
          </DashboardCard>

          <DashboardCard title="Earliest Time-in">
            <p className=" font-extrabold text-center text-6xl">
              {dashboardDailySummary?.earliestTimeIn &&
                formatDateStringToLocaleTime(
                  dashboardDailySummary?.earliestTimeIn.toString()
                )}
            </p>
          </DashboardCard>
        </div>
      ) : (
        <>
          <p>
            No attendance records for today was found.
          </p>
        </>
      )}

      <Separator className="mb-4" />

      <TypographyH2>User summary</TypographyH2>

      {dashboardUserSummary?.users ? (
        <DashboardUserTable users={dashboardUserSummary.users} />
      ) : (
        <p>
          No attendance records found.
        </p>
      )}

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
