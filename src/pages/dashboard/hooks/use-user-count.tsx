import { supabase } from "@/supabase/client"
import { useState, useEffect } from "react"

export default function useUserCount() {
  const [userCount, setUserCount] = useState<number>()
  const [activeUserCount, setActiveUserCount] = useState<number>()

  useEffect(() => {
    async function fetchUserCount() {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
      if (count) setUserCount(count)
    }
    async function fetchActiveUserCount() {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('is_active', true)
      if (count) setActiveUserCount(count)
    }
    fetchUserCount()
    fetchActiveUserCount()
  }, [])

  return { userCount, activeUserCount }
}
