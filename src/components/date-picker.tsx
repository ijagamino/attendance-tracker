import { ChevronDownIcon, CircleXIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { useState } from 'react'
import { ButtonGroup } from './ui/button-group'

export default function DatePicker({
  onSelectDate,
  id,
}: {
  onSelectDate: (selectedDate: Date | undefined) => void
  id: string
}) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <ButtonGroup >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="justify-between w-[calc(100%-40px)] font-normal"
          >
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            onSelectDate(undefined)
            setDate(undefined)
          }}
          disabled={!date}
        >
          <CircleXIcon
          />
        </Button>
      </ButtonGroup>

      <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            onSelectDate(date)
            setDate(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
