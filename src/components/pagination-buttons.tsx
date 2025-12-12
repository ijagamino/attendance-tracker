import {} from "react-day-picker";
import { Button } from "./ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default function PaginationButtons({
  page,
  totalPage,
  onPageChange,
}: {
  page: number;
  totalPage?: number;
  onPageChange: (newPage: number) => void;
}) {
  function handlePrevious() {
    if (page > 1) onPageChange(page - 1);
  }

  function handleNext() {
    if (totalPage !== undefined && page < totalPage) onPageChange(page + 1);
  }

  return (
    <div className="flex justify-center w-full gap-2 mx-auto mt-2">
      <Button
        onClick={handlePrevious}
        disabled={page <= 1}
      >
        <ArrowLeftIcon />
      </Button>

      <Button
        onClick={handleNext}
        disabled={totalPage === undefined || page === totalPage}
      >
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
