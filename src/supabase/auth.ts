import { supabase } from '@/supabase/client'
import type { Provider } from '@supabase/supabase-js'

export async function signUpWithEmail({
  email,
  password,
  firstName,
  lastName
}: {
  email: string,
  password: string,
  firstName: string,
  lastName: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName
      }
    }
  },)
  if (error) throw error
  if (!data.user) return

  return data
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}


export async function resetPasswordForEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/update-password`
  })

  if (error) throw error
  return data
}


export async function updateUserPassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password })

  if (error) throw error
}
