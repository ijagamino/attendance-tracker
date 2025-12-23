import PaginationButtons from '@/components/pagination-buttons.tsx'
import { Separator } from '@/components/ui/separator'
import { TypographyH1, TypographyH2, TypographyH4 } from '@/components/ui/typography'
import useQueryParam from '@/hooks/use-query-param.ts'
import { formatDateStringToLocaleTime, formatDateToLocal, formatInterval } from '@/lib/format'
import { supabase } from '@/supabase/client'
import type { DashboardDailySummary, DashboardUserSummary } from '@/supabase/global.types'
import { useCallback, useEffect, useState } from 'react'
import DashboardCard from './ui/card'
import DashboardUserTable from './ui/table'
import { Button } from '@/components/ui/button'
import { exportXlsx } from '@/lib/export'
import { FileSpreadsheetIcon } from 'lucide-react'

export default function DashboardPage() {
  const { searchParams, setParam } = useQueryParam({
    name: '',
    page: '1',
    limit: '5',
  })

  const [dashboardUserSummary, setDashboardUserSummary] = useState<DashboardUserSummary[]>()
  const [dashboardDailySummary, setDashboardDailySummary] = useState<DashboardDailySummary>()
  const [totalPage, setTotalPage] = useState<number>()

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)
  const name = searchParams.get('name') ?? ''

  const getDashboardUserSummary = useCallback(
    async ({ page, limit, name }: { page?: number, limit?: number, name?: string } = {}) => {

      const query = supabase
        .from('dashboard_user_summary')
        .select('*', { count: 'exact' })

      if (name) query.ilike('profiles.first_name', `%${name}%`)

      if (page && limit) {
        const rangeFrom = (page - 1) * limit
        const rangeTo = rangeFrom + limit - 1
        query.range(rangeFrom, rangeTo)
      }

      const { data, count, error } = await query.overrideTypes<Array<{ total_rendered_hours: string }>>()
      if (error) throw error

      return { data, count }
    },
    [],
  )

  useEffect(() => {
    async function fetchDashboard() {

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

      if (
        earliestTimeIn && attendees
      ) {
        setDashboardDailySummary({
          attendees,
          lateAttendees,
          earliestTimeIn: earliestTimeIn[0].min,
        })
      }
    }
    fetchDashboard()
  }, [])

  useEffect(() => {
    getDashboardUserSummary({ page, limit, name }).then(({ data, count }) => {
      setTotalPage(Math.ceil((count ?? 0) / limit))
      setDashboardUserSummary(data)
    })
  }, [getDashboardUserSummary, page, limit, name])


  async function handleExport() {
    exportXlsx<{
      name: string | null
      totalRenderedHours: string
    }>({
      worksheetName: "Attendance records",
      columns: [
        { label: 'Name', width: 20 },
        { label: 'Total Rendered Hours', width: 15 },
      ],
      fileName: `${formatDateToLocal(new Date(), "yyyy-MM-dd")}-dashboard-user-summary`,
      callback: async () => {
        const { data } = await getDashboardUserSummary({ page, name })

        if (!data) return []

        function timeStringToSeconds(time: string) {
          const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number);
          return hours * 3600 + minutes * 60 + seconds;
        }

        return data
          .filter(user => timeStringToSeconds(user.total_rendered_hours) > 0)
          .map((user) => ({
            name: user.first_name,
            totalRenderedHours: formatInterval(user.total_rendered_hours)
          }))
      }
    })
  }

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

      {dashboardUserSummary ? (
        <>
          <div className='px-2 py-4 flex justify-between items-center'>
            <TypographyH4>Attendance Records</TypographyH4>
            <Button onClick={() => {
              handleExport()
            }}>
              <FileSpreadsheetIcon />
              Export XLSX
            </Button>
          </div>

          <DashboardUserTable users={dashboardUserSummary} />
        </>
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
