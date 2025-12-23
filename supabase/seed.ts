import 'dotenv/config.js'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../src/supabase/database.types.ts'

const url = process.env.VITE_SUPABASE_URL
const secretKey = process.env.VITE_SUPABASE_SECRET_KEY

let supabase: SupabaseClient

if (url && secretKey) {
  supabase = createClient<Database>(url, secretKey)
} else {
  throw new Error('Cannot create client')
}

interface User {
  email: string
  password: string
  first_name: string
  role?: 'admin' | 'employee'
}

async function seed() {
  const users: User[] = [
    {
      email: 'admin@email.com',
      password: '123456',
      first_name: 'Admin',
      role: 'admin',
    },
    {
      email: 'ivan@email.com',
      password: '123456',
      first_name: 'Ivan',
    },
    {
      email: 'edward@email.com',
      password: '123456',
      first_name: 'Edward',
    },
    {
      email: 'charles@email.com',
      password: '123456',
      first_name: 'Charles',
    },
    {
      email: 'john@email.com',
      password: '123456',
      first_name: 'John',
    },
  ]

  for (const user of users) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          first_name: user.first_name,
          role: user.role ?? 'employee'
        }
      }
    })

    if (!data.user) return
    if (error) console.error(error)

    const userId = data.user.id

    console.log(
      `Created user: ${user.email} (${userId}, ${user.first_name})`
    )
  }

  process.exit(0)
}

seed()
