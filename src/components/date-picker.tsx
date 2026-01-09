import { ChevronDownIcon, CircleXIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { useState } from 'react'
import { ButtonGroup } from './ui/button-group'
import { cn } from '@/lib/utils'

export default function DatePicker({
  onSelectDate,
}: {
  onSelectDate: (selectedDate: Date | undefined) => void
}) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex">
        <ButtonGroup>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="justify-between w-48 font-normal"
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

      </div>

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
