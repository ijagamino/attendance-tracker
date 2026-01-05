import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenvFlow from 'dotenv-flow'
import type { Database } from '../src/supabase/database.types.ts'

dotenvFlow.config()

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
  password?: string
  first_name: string
  last_name: string
  role?: 'admin' | 'employee'
}

async function seed() {
  const users: User[] = [
    {
      email: 'admin@email.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
    },
    {
      email: 'ijagamino@gmail.com',
      first_name: 'Ivan Joshua',
      last_name: 'Gamino'
    },
    {
      email: 'edward@email.com',
      first_name: 'Edward',
      last_name: 'Gulmayo'
    },
    {
      email: 'charles@email.com',
      first_name: 'Charles',
      last_name: 'Valino'
    },
    {
      email: 'john@email.com',
      first_name: 'John',
      last_name: 'Doe'
    },
  ]

  for (const user of users) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password ?? 'test.Abc123',
      options: {
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role ?? 'employee'
        }
      }
    })

    if (!data.user) return
    if (error) console.error(error)

    const userId = data.user.id

    console.log(
      `Created user: ${user.email} (${userId}, ${user.first_name}) ${user.last_name}`
    )
  }

  process.exit(0)
}

seed()
