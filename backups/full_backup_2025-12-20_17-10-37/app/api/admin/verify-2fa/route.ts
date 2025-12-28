import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { get2FACode, delete2FACode } from '../../../../lib/admin-2fa-store'

// Allow static export (API routes won't work in static export, but build will succeed)
export const dynamic = 'force-static'

export async function POST(req: NextRequest) {
  // Static export: return error (API routes don't work in static export)
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'API not available in static export' }, { status: 503 })
  }
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const stored = get2FACode(email)

    if (!stored) {
      return NextResponse.json({ error: 'Code not found or expired. Please request a new code.' }, { status: 400 })
    }

    if (Date.now() > stored.expiresAt) {
      delete2FACode(email)
      return NextResponse.json({ error: 'Code expired. Please request a new code.' }, { status: 400 })
    }

    if (stored.code !== code) {
      return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
    }

    // Code is valid - create session
    const sessionToken = crypto.randomUUID()
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    // Store session (in production, use database or Redis)
    // For now, we'll use a cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
    })

    // Delete used code
    delete2FACode(email)

    return NextResponse.json({ success: true, sessionToken })
  } catch (error) {
    console.error('Error verifying 2FA code:', error)
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}
