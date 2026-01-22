import PaginationButtons from "@/components/pagination-buttons";
import { TypographyH2 } from "@/components/ui/typography";
import useQueryParam from "@/hooks/use-query-param";
import useLoggedActions from "./hooks/use-logged-actions";
import LoggedActionTable from "./ui/table";

export default function ActivityLogsPage() {
  const { searchParams, setParam } = useQueryParam({
    page: '1',
    limit: '5',
  })

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 5)

  const { loggedActions, totalPage } = useLoggedActions({ page, limit })

  return (
    <>
      <div className="flex justify-between items-center">
        <header>
          <TypographyH2>Activity Logs</TypographyH2>
        </header>
      </div >

      <div className="mt-2">
        <LoggedActionTable
          loggedActions={loggedActions}
        />

        <PaginationButtons
          page={page}
          totalPage={totalPage}
          onPageChange={(newPage) => {
            setParam('page', newPage.toString())
          }}
        />
      </div>
    </>
  )
}
