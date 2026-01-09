import { supabase } from "@/supabase/client"
import { toast } from "sonner"

export default async function markUserAbsent(userId: string) {
  const today = new Date().toISOString()

  const { data, error } = await supabase
    .from('attendance_records')
    .upsert(
      { user_id: userId, date: today, time_in: null, time_out: null },
      { onConflict: 'user_id, date' }
    )
    .select('*, profiles!inner(id, first_name)')
    .overrideTypes<Array<{ total_hours: string }>>()

  if (error) {
    toast.error(error.message)
    return
  }

  toast.success(`${data[0].profiles.first_name} marked as absent.`)
  return data
}
