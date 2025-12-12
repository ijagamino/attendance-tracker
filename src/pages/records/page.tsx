import { get } from "@/lib/apiFetch";
import { formatDateToLocal } from "@/lib/date";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type {
  ApiResponse,
  AttendanceRecord,
  AttendanceRecordResponse,
} from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import DatePicker from "@/components/date-picker";
import AttendanceRecordTable from "./ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default function RecordsPage() {
  const [searchParams, setSearchParams] = useSearchParams({
    name: "",
    date: "",
    page: "1",
  });

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>();

  function handleParamChange(key: string, val: string) {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set(key, val);
      return newParams;
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    get(`attendance-records?${params}`).then(
      (response: ApiResponse<AttendanceRecordResponse>) => {
        setAttendanceRecords(
          response.data.attendanceRecords.items.map((item) => ({
            ...item,
            date: formatDateToLocal(item.date, "MM-dd-yyyy"),
          }))
        );
        setTotalPage(response.data.attendanceRecords.pagination.totalPage);
        setPage(response.data.attendanceRecords.pagination.page);
      }
    );
  }, [searchParams]);

  return (
    <>
      <div className="flex justify-between mb-2 space-x-2">
        <div className="flex-1 max-w-sm space-y-1">
          <Label htmlFor="name">Search name</Label>
          <Input
            id="name"
            placeholder="Search by name..."
            onChange={(event) => {
              handleParamChange("name", event.target.value);
            }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="date">Filter by date</Label>
          <DatePicker
            date={date}
            onSelect={(selectedDate: Date | undefined) => {
              setDate(selectedDate);
              if (selectedDate) {
                handleParamChange("date", format(selectedDate, "yyyy-MM-dd"));
              }
            }}
          />
        </div>
      </div>

      <AttendanceRecordTable attendanceRecords={attendanceRecords} />

      <div className="flex justify-center w-full gap-2 mx-auto mt-2">
        <Button
          onClick={() => {
            const previousPage = page - 1;
            setPage(previousPage);
            handleParamChange("page", String(previousPage));
          }}
          disabled={page <= 1}
        >
          <ArrowLeftIcon />
        </Button>

        <Button
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            handleParamChange("page", String(nextPage));
          }}
          disabled={page === totalPage}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </>
  );
}
