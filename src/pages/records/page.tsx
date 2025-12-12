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
import { TypographyH1 } from "@/components/ui/typography";
import PaginationButtons from "@/components/pagination-buttons";

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
      <header>
        <TypographyH1>Attendance Records</TypographyH1>
      </header>

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

      <PaginationButtons
        page={page}
        totalPage={totalPage}
        onPageChange={(newPage) => {
          setPage(newPage);
          handleParamChange("page", newPage.toString());
        }}
      />
    </>
  );
}
