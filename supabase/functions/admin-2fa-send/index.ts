const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function generateSecureCode(length: number = 10): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let code = '';
  
  code += uppercase[Math.floor(Math.random() * uppercase.length)];
  code += lowercase[Math.floor(Math.random() * lowercase.length)];
  code += numbers[Math.floor(Math.random() * numbers.length)];
  code += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = code.length; i < length; i++) {
    code += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return code.split('').sort(() => Math.random() - 0.5).join('');
}

// Simple in-memory store (in production, use Supabase or Redis)
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
    const email = body?.email;

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate admin email
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'contact@shametoflame.faith';
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate code
    const code = generateSecureCode(10);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store code
    codeStore.set(email.toLowerCase(), { code, expiresAt });

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey && resendApiKey.trim().length > 0) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Shame to Flame Admin <noreply@shametoflame.faith>',
            to: [email],
            subject: 'Your Admin Login Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ea580c;">Admin Login Code</h2>
                <p>Your 2FA code for Shame to Flame admin access:</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <code style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #ea580c;">${code}</code>
                </div>
                <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
              </div>
            `,
            text: `Your Admin Login Code: ${code}\n\nThis code will expire in 10 minutes.`,
          }),
        });

        if (emailResponse.ok) {
          return new Response(
            JSON.stringify({ success: true, message: '2FA code sent to your email' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    // Development fallback: return code in response
    return new Response(
      JSON.stringify({
        success: true,
        message: '2FA code generated (dev mode)',
        devCode: code, // Only in dev, remove in production
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending 2FA code:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send 2FA code' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});



