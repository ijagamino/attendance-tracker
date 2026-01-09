import { supabase } from "@/supabase/client"
import type { UserProfileSummary } from "@/supabase/global.types"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export default function useUserProfileSummary(userId?: string) {
  const [userProfileSummary, setUserProfileSummary] = useState<UserProfileSummary>()

  const getUserProfileSummary = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from('user_profile_summary')
        .select('*')
        .eq('id', userId)
        .single()
        .overrideTypes<{ total_rendered_hours: string }>()

      if (error) {
        toast.error(error.message)
        return
      }

      return data
    }, [])

  useEffect(() => {
    if (!userId) return
    getUserProfileSummary(userId)
      .then((data => {
        setUserProfileSummary(data)
      }))
  }, [getUserProfileSummary, userId])

  const refetch = useCallback(() => {
    if (!userId) return
    return getUserProfileSummary(userId)
      .then((data => {
        setUserProfileSummary(data)
      }))
  }, [getUserProfileSummary, userId])

  const [hours, minutes, seconds] = userProfileSummary?.total_rendered_hours?.split('.')[0].split(":") ?? []

  return {
    userProfileSummary,
    hours,
    minutes,
    seconds,
    totalLates: userProfileSummary?.total_lates ?? 0,
    totalAbsents: userProfileSummary?.total_absents ?? 0,
    refetch
  }
}
