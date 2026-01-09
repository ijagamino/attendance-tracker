export function isValidDate(value: string | number | Date) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}
