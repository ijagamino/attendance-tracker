import { useSearchParams } from 'react-router'
import { useCallback } from 'react'

export default function useQueryParam(initialState: Record<string, string>) {
  const [searchParams, setSearchParams] = useSearchParams(initialState)

  const setParam = useCallback(
    (key: string, val: string) => {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams)
        newParams.set(key, val)
        return newParams
      })
    },
    [setSearchParams]
  )

  return { searchParams, setParam }
}
