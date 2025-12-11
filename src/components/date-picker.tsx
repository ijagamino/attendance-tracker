import { ChevronDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { useState } from "react";

export default function DatePicker({
  date,
  onSelect,
}: {
  date: Date | undefined;
  onSelect: (selectedDate: Date | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="justify-between w-48 font-normal"
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 overflow-hidden"
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
