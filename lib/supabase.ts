export type SubmitResult = { success: boolean; error?: string; message?: string }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function postToEdgeFunction(path: string, body: unknown): Promise<SubmitResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      error: 'Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).',
    }
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(body),
    })

    const json = (await res.json()) as SubmitResult
    if (!res.ok) {
      return { success: false, error: json?.error || `Request failed (${res.status})` }
    }
    return json
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' }
  }
}

/**
 * Placeholder implementation.
 *
 * The UI components in `src/old_pages_backup/*` already fall back to `mailto:` if
 * submission fails. This keeps builds working until Supabase (or another backend)
 * is configured.
 */
export async function submitContact(_data: {
  name?: string
  email?: string
  request_type: string
  subject?: string
  message: string
}): Promise<SubmitResult> {
  return postToEdgeFunction('submit-contact', _data)
}

export async function submitPrayer(_data: {
  name: string | null
  email: string | null
  is_anonymous: boolean
  prayer_request: string
  allow_sharing: boolean
}): Promise<SubmitResult> {
  return postToEdgeFunction('submit-prayer', _data)
}
