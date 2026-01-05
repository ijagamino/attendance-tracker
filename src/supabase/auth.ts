import { supabase } from '@/supabase/client'
import type { Provider } from '@supabase/supabase-js'


function getURL() {
  let url =
    import.meta.env.VITE_FRONTEND_URL ??
    'http://127.0.0.1:3000'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  return url
}

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
    redirectTo: `${getURL()}/update-password`
  })

  if (error) throw error
  return data
}


export async function updateUserPassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password })

  if (error) throw error
}
