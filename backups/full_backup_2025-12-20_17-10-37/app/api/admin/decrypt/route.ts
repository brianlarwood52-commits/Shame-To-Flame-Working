import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Allow static export (API routes won't work in static export, but build will succeed)
export const dynamic = 'force-static'

export async function POST(req: NextRequest) {
  // Static export: return error (API routes don't work in static export)
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'API not available in static export' }, { status: 503 })
  }
  
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  
  if (!session?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { ciphertext_b64, iv_b64 } = await req.json()

    if (!ciphertext_b64 || !iv_b64) {
      return NextResponse.json({ error: 'Missing ciphertext or IV' }, { status: 400 })
    }

    // Get encryption key from environment
    const keyB64 = process.env.MESSAGE_ENCRYPTION_KEY_B64
    if (!keyB64) {
      return NextResponse.json({ error: 'Encryption key not configured' }, { status: 500 })
    }

    // Decrypt using Web Crypto API (same as Edge Function)
    const keyBytes = Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0))
    const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['decrypt'])

    const iv = Uint8Array.from(atob(iv_b64), (c) => c.charCodeAt(0))
    const data = Uint8Array.from(atob(ciphertext_b64), (c) => c.charCodeAt(0))

    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    const decoded = new TextDecoder().decode(plaintext)

    return NextResponse.json({ success: true, plaintext: decoded })
  } catch (error) {
    console.error('Decryption error:', error)
    return NextResponse.json({ error: 'Failed to decrypt message' }, { status: 500 })
  }
}
