import { ChevronDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function DatePicker({
  date,
  onSelect,
}: {
  date: Date | undefined;
  onSelect: (selectedDate: Date | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  // const [date, setDate] = useState<Date | undefined>(undefined);

  // useEffect(() => {
  //   // console.log(date);
  //   if (date) {
  //     console.log(format(date, "MM-dd-yy"));
  //   }
  // }, [date]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-48 justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            onSelect(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
