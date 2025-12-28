import { createClient } from 'npm:@supabase/supabase-js@2';
import { encryptText } from '../_shared/crypto.ts'
import { triageMessage } from '../_shared/triage.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// Category to email mapping (configurable via environment variables)
function getEmailForCategory(category: string): string {
  console.log('[getEmailForCategory] Input category:', category);
  
  // Map category to environment variable name
  const envVarMap: Record<string, string> = {
    'general': 'EMAIL_GENERAL',
    'prayer': 'EMAIL_PRAYER',
    'bible-study': 'EMAIL_BIBLE_STUDY',
    'testimony': 'EMAIL_TESTIMONY',
    'crisis': 'EMAIL_CRISIS',
  };
  
  const envVarName = envVarMap[category];
  console.log('[getEmailForCategory] Looking for env var:', envVarName);
  
  if (envVarName) {
    const envEmail = Deno.env.get(envVarName);
    console.log('[getEmailForCategory] Found env var value:', envEmail || 'NOT SET');
    if (envEmail && envEmail.trim()) {
      return envEmail.trim();
    }
  }
  
  // Fallback to category-specific defaults
  const categoryMap: Record<string, string> = {
    'general': 'contact@shametoflame.faith',
    'prayer': 'prayer-request@shametoflame.faith',
    'bible-study': 'bible-study@shametoflame.faith',
    'testimony': 'testimony@shametoflame.faith',
    'crisis': 'crisis@shametoflame.faith',
  };
  
  const defaultEmail = categoryMap[category] || categoryMap['general'];
  console.log('[getEmailForCategory] Using default email:', defaultEmail);
  return defaultEmail;
}

async function sendEmailNotification(data: ContactSubmission, category: string, riskLevel: string, flags: string[]) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  const displayName = data.name?.trim() || 'Anonymous';
  const displayEmail = data.email?.trim() || 'Not provided';
  const isAnonymous = !data.name?.trim() && !data.email?.trim();
  const recipientEmail = getEmailForCategory(category);
  
  // Debug logging
  console.log('[Email Notification] Category:', category);
  console.log('[Email Notification] Request Type:', data.request_type);
  console.log('[Email Notification] EMAIL_BIBLE_STUDY env:', Deno.env.get('EMAIL_BIBLE_STUDY'));
  console.log('[Email Notification] EMAIL_BIBLE-STUDY env:', Deno.env.get('EMAIL_BIBLE-STUDY'));
  console.log('[Email Notification] All EMAIL_* env vars:', Object.keys(Deno.env.toObject()).filter(k => k.startsWith('EMAIL_')));
  console.log('[Email Notification] Recipient Email:', recipientEmail);

  // Privacy by default: do not email the raw message content.
  const emailBody = `
New Contact Form Submission

Category: ${category.charAt(0).toUpperCase() + category.slice(1)}
Risk Level: ${riskLevel.toUpperCase()}
${flags.length > 0 ? `Flags: ${flags.join(', ')}` : ''}

From: ${displayName}
Email: ${displayEmail}
Type: ${isAnonymous ? 'Anonymous' : 'Public'}
Request Type: ${data.request_type || 'general'}
Subject: ${data.subject || 'No subject'}

Note: The message content is stored encrypted for privacy. View it in the admin dashboard.

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
        from: 'Shame to Flame Contact <noreply@shametoflame.faith>',
        to: [recipientEmail],
        subject: `[${category.toUpperCase()}] New Contact: ${data.subject || 'No Subject'}`,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Email Notification] ❌ FAILED to send email');
      console.error('[Email Notification] Status:', response.status);
      console.error('[Email Notification] Error:', error);
      console.error('[Email Notification] Recipient was:', recipientEmail);
    } else {
      const result = await response.json();
      console.log('[Email Notification] ✅ SUCCESS - Email sent');
      console.log('[Email Notification] Recipient:', recipientEmail);
      console.log('[Email Notification] Category:', category);
      console.log('[Email Notification] Resend ID:', result.id);
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

interface ContactSubmission {
  name?: string;
  email?: string;
  request_type: string;
  subject?: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
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

    const data: ContactSubmission = await req.json();

    // Only message is required; name and email are optional (anonymous by default)
    if (!data.message || !data.message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email only if provided
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

    // Encrypt message before storage (privacy by default)
    const encrypted = await encryptText(data.message.trim())
    const triage = triageMessage({ requestType: data.request_type || 'general', text: data.message })
    
    // Debug logging
    console.log('=== CONTACT FORM SUBMISSION DEBUG ===');
    console.log('[Contact Submission] Request Type from form:', data.request_type);
    console.log('[Contact Submission] Triage Category:', triage.category);
    console.log('[Contact Submission] Triage Risk Level:', triage.risk_level);
    console.log('[Contact Submission] Will send email notification...');

    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name: data.name?.trim() || null,
        email: data.email?.trim().toLowerCase() || null,
        request_type: data.request_type || 'general',
        subject: data.subject?.trim() || null,
        message: null,
        encrypted_message: encrypted.ciphertext_b64,
        encryption_iv: encrypted.iv_b64,
        category: triage.category,
        risk_level: triage.risk_level,
        flags: triage.flags,
        status: 'new'
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit contact form' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send email notification based on category
    await sendEmailNotification(data, triage.category, triage.risk_level, triage.flags);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for reaching out. We will respond to your message within 24-48 hours.' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});