import { format } from 'date-fns'

export function formatDateToLocal(date: string, dateFormat: string) {
  return format(new Date(date).toString(), dateFormat)
}

export function formatDateStringToLocaleTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString()
}
