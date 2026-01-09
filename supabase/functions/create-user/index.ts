// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2"
import { corsHeaders } from '../_shared/cors.ts'

interface User {
  email: string
  password: string
  firstName: string
  lastName: string
}

async function createUser(supabase: SupabaseClient, user: User) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    user_metadata: {
      first_name: user.firstName,
      last_name: user.lastName
    }
  })

  if (error) throw error

  return new Response(JSON.stringify({ user }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

const supabase = createClient

Deno.serve(async (req) => {
  const { url, method } = req
  if (method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  const supabaseUrl = (Deno.env.get('SUPABASE_URL') ?? '')
  const supabaseSecretKey = (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')

  try {
    const supabase = createClient(
      supabaseUrl,
      supabaseSecretKey
    )

    let user = null
    if (method === 'POST' || method === 'PUT') {
      const body = await req.json()
      user = body.user
    }

    switch (true) {
      case method === 'POST':
        return await createUser(supabase, user)
    }

  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
