import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY // make sure this is the anon or service role key
)

function getURL() {
  let url =
    process.env.VERCEL_URL ??
    'http://127.0.0.1:3000'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  return url
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}/update-password`,
    });

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
