import { format } from 'date-fns'

export function formatDateToLocal(date: string | Date, dateFormat: string) {
  if (date === typeof Date) return format(date, dateFormat)
  return format(new Date(date).toString(), dateFormat)
}

export function formatDateStringToLocaleTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString()
}

export function formatInterval(interval: string | null) {
  if (!interval) return '0m'

  // Supports HH:MM:SS(.ms)
  const [h = '0', m = '0'] = interval.split(':')
  const hours = Number(h)
  const minutes = Number(m)

  if (hours > 0 && minutes > 0) return `${hours}h${minutes}m`
  if (hours > 0) return `${hours}h`
  if (minutes > 0) return `${minutes}m`

  return '0m'
}
