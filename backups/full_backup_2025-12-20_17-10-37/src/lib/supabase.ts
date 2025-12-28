const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};

export async function submitContact(data: {
  name?: string;
  email?: string;
  request_type: string;
  subject?: string;
  message: string;
}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Supabase is not configured.' }
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/submit-contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

export async function submitPrayer(data: {
  name?: string | null;
  email?: string | null;
  is_anonymous: boolean;
  prayer_request: string;
  allow_sharing: boolean;
}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: 'Supabase is not configured.' }
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/submit-prayer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(data)
  });

  return response.json();
}
