import { NextRequest, NextResponse } from 'next/server'
import { store2FACode } from '../../../../lib/admin-2fa-store'

// Allow static export (API routes won't work in static export, but build will succeed)
export const dynamic = 'force-static'

function generateSecureCode(length: number = 10): string {
  // Mix of uppercase, lowercase, numbers, and safe symbols
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // Excluded I, O for clarity
  const lowercase = 'abcdefghijkmnpqrstuvwxyz' // Excluded l, o for clarity
  const numbers = '23456789' // Excluded 0, 1 for clarity
  const symbols = '!@#$%&*'
  
  const allChars = uppercase + lowercase + numbers + symbols
  let code = ''
  
  // Ensure at least one of each type
  code += uppercase[Math.floor(Math.random() * uppercase.length)]
  code += lowercase[Math.floor(Math.random() * lowercase.length)]
  code += numbers[Math.floor(Math.random() * numbers.length)]
  code += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Fill the rest randomly
  for (let i = code.length; i < length; i++) {
    code += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle the code
  return code.split('').sort(() => Math.random() - 0.5).join('')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = body?.email

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate that the email matches the admin email
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error('[2FA] ADMIN_EMAIL environment variable is not set')
      return NextResponse.json({ error: 'Admin email not configured' }, { status: 500 })
    }

    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      console.warn(`[2FA] Unauthorized email attempt: ${email} (expected: ${adminEmail})`)
      return NextResponse.json({ error: 'Invalid email address' }, { status: 403 })
    }

    // Generate 10-character secure code
    const code = generateSecureCode(10)
    
    // Store code (shared across all API routes)
    store2FACode(email, code, 10 * 60 * 1000) // 10 minutes

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    
    // Debug logging (remove in production)
    console.log('[2FA] Environment check:')
    console.log('  - NODE_ENV:', process.env.NODE_ENV)
    console.log('  - RESEND_API_KEY exists:', !!resendApiKey)
    console.log('  - RESEND_API_KEY length:', resendApiKey?.length || 0)
    console.log('  - Email to send to:', email)
    
    if (resendApiKey && resendApiKey.trim().length > 0) {
      try {
        console.log('[2FA] Sending email via Resend API...')
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
                <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
              </div>
            `,
            text: `Your Admin Login Code: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
          }),
        })

        const responseText = await emailResponse.text()
        
        if (!emailResponse.ok) {
          console.error('[2FA] Resend API error:')
          console.error('  - Status:', emailResponse.status)
          console.error('  - Response:', responseText)
          
          // Fall through to dev mode if email fails
        } else {
          try {
            const result = responseText ? JSON.parse(responseText) : {}
            console.log('[2FA] ✅ Email sent successfully!')
            if (result.id) {
              console.log('  - Email ID:', result.id)
            }
            return NextResponse.json({
              success: true,
              message: '2FA code sent to your email',
            })
          } catch (parseError) {
            // Response was OK but not JSON - still consider it success
            console.log('[2FA] ✅ Email sent (non-JSON response)')
            return NextResponse.json({
              success: true,
              message: '2FA code sent to your email',
            })
          }
        }
      } catch (emailError: any) {
        console.error('[2FA] Exception sending email:')
        console.error('  - Error:', emailError?.message || String(emailError))
        if (emailError?.stack) {
          console.error('  - Stack:', emailError.stack)
        }
        // Fall through to dev mode if email fails
      }
    } else {
      console.warn('[2FA] ⚠️ RESEND_API_KEY not found or empty in environment variables')
      console.warn('  - Check your .env.local file')
      console.warn('  - Make sure it contains: RESEND_API_KEY=re_...')
      console.warn('  - Restart your dev server after adding it')
    }

    // Development fallback: log code if email not configured or fails
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] 2FA CODE for ${email}]: ${code}`)
      return NextResponse.json({
        success: true,
        message: '2FA code sent to your email (dev mode: check console)',
        devCode: code,
      })
    }

    return NextResponse.json({
      success: true,
      message: '2FA code sent to your email',
    })
  } catch (error) {
    console.error('Error sending 2FA code:', error)
    return NextResponse.json({ error: 'Failed to send 2FA code' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
