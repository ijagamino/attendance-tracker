import { } from 'react-day-picker'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from './ui/pagination'
import { cn } from '@/lib/utils'

export default function PaginationButtons({
  page,
  totalPage,
  onPageChange,
}: {
  page: number
  totalPage?: number
  onPageChange: (newPage: number) => void
}) {
  function handlePrevious() {
    if (page > 1) onPageChange(page - 1)
  }

  function handleNext() {
    if (totalPage !== undefined && page < totalPage) onPageChange(page + 1)
  }

  return (
    <Pagination className="mt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn("cursor-pointer",
              page <= 1 ? "pointer-events-none opacity-50" : undefined
            )}
            tabIndex={page <= 1 ? -1 : undefined}
            aria-disabled={page <= 1}
            onClick={handlePrevious}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={cn("cursor-pointer",
              (totalPage === undefined ||
                totalPage === null ||
                totalPage <= 0 ||
                page === totalPage
              ) ? "pointer-events-none opacity-50" : undefined
            )}
            tabIndex={(totalPage === undefined ||
              totalPage === null ||
              totalPage <= 0 ||
              page === totalPage) ? +1 : undefined}
            aria-disabled={
              totalPage === undefined ||
              totalPage === null ||
              totalPage <= 0 ||
              page === totalPage
            }
            onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
