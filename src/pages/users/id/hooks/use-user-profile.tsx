import { supabase } from "@/supabase/client"
import type { Profile } from "@/supabase/global.types"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export default function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile>()

  const getUserProfile = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        toast.error(error.message)
        return
      }

      return data
    }, [])

  useEffect(() => {
    if (!userId) return
    getUserProfile(userId).then((data => {
      setProfile(data)
    }))
  }, [getUserProfile, userId])

  async function toggleActive() {
    if (!profile) return
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: !profile.is_active })
      // .update({ is_active: false })
      .eq('id', profile.id)
      .select("*")
      .single()

    if (error) {
      toast.error(error.message)
      return
    }

    if (data) {
      setProfile(data)
      toast.success(`User marked as ${data.is_active ? 'active' : 'inactive'}`)
    }
  }

  const refetch = useCallback(() => {
    if (!userId) return
    return getUserProfile(userId)
      .then((data => {
        setProfile(data)
      }))
  }, [getUserProfile, userId])

  return {
    profile,
    toggleActive,
    refetch
  }
}
