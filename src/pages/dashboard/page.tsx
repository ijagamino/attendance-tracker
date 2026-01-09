import PaginationButtons from '@/components/pagination-buttons.tsx'
import { Separator } from '@/components/ui/separator'
import { TypographyH1, TypographyH2, TypographyH4 } from '@/components/ui/typography'
import useQueryParam from '@/hooks/use-query-param.ts'
import DashboardCard from './ui/card'
import DashboardUserTable from './ui/table'
import { Button } from '@/components/ui/button'
import { FileSpreadsheetIcon, Frown } from 'lucide-react'
import { useDashboardDailySummary } from './hooks/use-dashboard-daily-summary'
import { useDashboardUserSummary } from './hooks/use-dashboard-user-summary'
import useUserCount from './hooks/use-user-count'
import exportAttendanceRecords from './actions/export-attendance-records'
import { formatDateStringToLocaleTime } from '@/lib/format'

export default function DashboardPage() {
  const { searchParams, setParam } = useQueryParam({
    name: '',
    page: '1',
    limit: '5',
  })

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)
  const name = searchParams.get('name') ?? ''

  const { dashboardDailySummary } = useDashboardDailySummary()
  const { dashboardUserSummary, totalPage, getDashboardUserSummary } = useDashboardUserSummary({ page, limit, name })
  const { userCount, activeUserCount } = useUserCount()

  async function handleExport() {
    await exportAttendanceRecords({ getDashboardUserSummary })
  }

  return (
    <>
      <header>
        <TypographyH1>Dashboard</TypographyH1>
      </header>

      <TypographyH2>Daily summary</TypographyH2>

      <div className="grid my-8 grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard className="col-span-2" title="Time In">
          <p className="font-extrabold text-center text-6xl">
            {dashboardDailySummary?.time_in_count}
          </p>
        </DashboardCard>

        <DashboardCard className="col-span-2" title="Time Out">
          <p className="font-extrabold text-center text-6xl">
            {dashboardDailySummary?.time_out_count}
          </p>
        </DashboardCard>

        <DashboardCard title="Late">
          <p className="font-extrabold text-center text-6xl">
            {dashboardDailySummary?.late_count}
          </p>
        </DashboardCard>

        <DashboardCard title="Absent">
          <p className="font-extrabold text-center text-6xl">
            {dashboardDailySummary?.absent_count}
          </p>
        </DashboardCard>

        <DashboardCard className="col-span-2" title="Earliest Time-in">
          {dashboardDailySummary?.earliest_time_in ?
            (
              <p className=" font-extrabold text-center text-6xl">
                {formatDateStringToLocaleTime(
                  dashboardDailySummary?.earliest_time_in)}
              </p>
            ) : (
              <Frown className="mx-auto" size={64} />
            )
          }
        </DashboardCard>
      </div >

      <Separator className="mb-4" />

      <TypographyH2>User summary</TypographyH2>

      <div className="grid my-8 grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard title="Total Users">
          <p className=" font-extrabold text-center text-6xl">
            {userCount &&
              userCount
            }
          </p>
        </DashboardCard>

        <DashboardCard title="Total Active Users">
          <p className=" font-extrabold text-center text-6xl">
            {activeUserCount &&
              activeUserCount
            }
          </p>
        </DashboardCard>
      </div>

      {
        dashboardUserSummary ? (
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
        )
      }

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
