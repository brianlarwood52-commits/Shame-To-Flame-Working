const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// Simple in-memory store (matches admin-2fa-send)
const codeStore = new Map<string, { code: string; expiresAt: number }>();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stored = codeStore.get(email.toLowerCase());

    if (!stored) {
      return new Response(
        JSON.stringify({ error: 'Code not found or expired. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (Date.now() > stored.expiresAt) {
      codeStore.delete(email.toLowerCase());
      return new Response(
        JSON.stringify({ error: 'Code expired. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (stored.code !== code) {
      return new Response(
        JSON.stringify({ error: 'Invalid code. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Code is valid - generate session token
    const sessionToken = crypto.randomUUID();
    
    // Delete used code
    codeStore.delete(email.toLowerCase());

    // TODO: Store session in Supabase or Redis for production
    // For now, return token (client should store it)

    return new Response(
      JSON.stringify({ success: true, sessionToken }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to verify code' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});



