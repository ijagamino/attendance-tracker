import { useSearchParams } from "react-router";
import AttendanceTable from "./ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/date-picker";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { AttendanceRecord, FetchAttendanceRecord } from "./types";
import { get } from "@/lib/apiFetch";
import { formatDateToLocal } from "@/lib/date";

export default function RecordsPage() {
  const [searchParams, setSearchParams] = useSearchParams({
    name: "",
    date: "",
    page: "",
  });

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  function handleParamChange(key: string, val: string) {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set(key, val);
      return newParams;
    });
  }

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [totalPage, setTotalPage] = useState<number>();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    get(`attendance-records?${params}`).then((data: FetchAttendanceRecord) => {
      setAttendanceRecords(
        data.rows.map((item) => ({
          ...item,
          date: formatDateToLocal(item.date, "MM-dd-yyyy"),
        }))
      );
      setTotalPage(data.totalPage);
    });
  }, [searchParams]);

  return (
    <>

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

      <AttendanceTable attendanceRecords={attendanceRecords} />

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
