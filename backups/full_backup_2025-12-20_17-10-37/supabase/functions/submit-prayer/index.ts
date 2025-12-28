import { createClient } from 'npm:@supabase/supabase-js@2';
import { encryptText } from '../_shared/crypto.ts'
import { triageMessage } from '../_shared/triage.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PrayerSubmission {
  name?: string;
  email?: string;
  is_anonymous: boolean;
  prayer_request: string;
  allow_sharing: boolean;
}

async function sendEmailNotification(data: PrayerSubmission) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  const displayName = data.name?.trim() || 'Anonymous';
  const displayEmail = data.email?.trim() || 'Not provided';
  const isAnonymous = !data.name?.trim() && !data.email?.trim();

  // Privacy by default: do not email the raw prayer request content.
  const emailBody = `
New Prayer Request Received

From: ${displayName}
Email: ${displayEmail}
Type: ${isAnonymous ? 'Anonymous' : 'Public'}
Allow Sharing: ${data.allow_sharing ? 'Yes' : 'No'}

Note: The message content is stored encrypted for privacy.

---
Submitted on ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Prayer Requests <noreply@shametoflame.faith>',
        to: ['prayer-request@shametoflame.faith'],
        subject: `New Prayer Request from ${displayName}`,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Email Notification] ❌ Failed to send email');
      console.error('[Email Notification] Status:', response.status);
      console.error('[Email Notification] Error:', error);
    } else {
      const result = await response.json();
      console.log('[Email Notification] ✅ Email sent successfully');
      console.log('[Email Notification] Resend ID:', result.id);
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

Deno.serve(async (req: Request) => {
  console.log('[Prayer Request] Function started, method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('[Prayer Request] Creating Supabase client...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[Prayer Request] Parsing request body...');
    const data: PrayerSubmission = await req.json();
    console.log('[Prayer Request] Received data:', {
      hasName: !!data.name,
      hasEmail: !!data.email,
      is_anonymous: data.is_anonymous,
      hasPrayerRequest: !!data.prayer_request,
      allow_sharing: data.allow_sharing
    });

    if (!data.prayer_request || !data.prayer_request.trim()) {
      return new Response(
        JSON.stringify({ error: 'Prayer request is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email only if provided (name and email are optional - anonymous by default)
    if (data.email && data.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        return new Response(
          JSON.stringify({ error: 'Invalid email address' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Encrypt prayer request before storage (privacy by default)
    console.log('[Prayer Request] Encrypting message...');
    const encrypted = await encryptText(data.prayer_request.trim())
    console.log('[Prayer Request] Message encrypted successfully');
    
    console.log('[Prayer Request] Running triage...');
    const triage = triageMessage({ requestType: 'prayer', text: data.prayer_request })
    console.log('[Prayer Request] Triage complete:', {
      category: triage.category,
      risk_level: triage.risk_level,
      flags: triage.flags
    });

    console.log('[Prayer Request] Inserting into database...');
    const { error: insertError } = await supabase
      .from('prayer_requests')
      .insert({
        name: data.is_anonymous ? null : data.name?.trim(),
        email: data.is_anonymous ? null : data.email?.trim().toLowerCase(),
        is_anonymous: data.is_anonymous,
        prayer_request: null,
        encrypted_message: encrypted.ciphertext_b64,
        encryption_iv: encrypted.iv_b64,
        category: triage.category,
        risk_level: triage.risk_level,
        flags: triage.flags,
        allow_sharing: data.allow_sharing || false,
        status: 'new'
      });

    if (insertError) {
      console.error('[Prayer Request] ❌ Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit prayer request' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[Prayer Request] ✅ Database insert successful');
    console.log('[Prayer Request] Sending email notification...');
    
    try {
      await sendEmailNotification(data);
      console.log('[Prayer Request] ✅ Email notification sent successfully');
    } catch (emailErr) {
      console.error('[Prayer Request] ⚠️ Email notification failed (non-critical):', emailErr);
      // Don't fail the request if email fails
    }

    console.log('[Prayer Request] ✅ Function completing successfully');
    
    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Your prayer request has been received. We will lift you up in prayer and respond within 24-48 hours.'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
    // Force log flush before returning
    console.log('[Prayer Request] Returning response...');
    return response;
  } catch (error) {
    console.error('[Prayer Request] ❌ EXCEPTION:', error);
    console.error('[Prayer Request] Error type:', error?.constructor?.name);
    console.error('[Prayer Request] Error message:', error?.message);
    if (error?.stack) {
      console.error('[Prayer Request] Stack trace:', error.stack);
    }
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});