import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Allow static export (API routes won't work in static export, but build will succeed)
export const dynamic = 'force-static'

export async function GET(req: NextRequest) {
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // Use service role key for admin (bypasses RLS) - NEVER expose this to client!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 })
    }

    if (!supabaseKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is missing - admin cannot read messages')
      return NextResponse.json({ 
        error: 'Admin access not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local',
        hint: 'Get it from Supabase Dashboard → Settings → API → service_role key'
      }, { status: 500 })
    }

    const [contactsRes, prayersRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/contact_submissions?select=*&order=created_at.desc`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }),
      fetch(`${supabaseUrl}/rest/v1/prayer_requests?select=*&order=created_at.desc`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }),
    ])

    if (!contactsRes.ok) {
      console.error('Contacts fetch failed:', contactsRes.status, await contactsRes.text())
    }
    if (!prayersRes.ok) {
      console.error('Prayers fetch failed:', prayersRes.status, await prayersRes.text())
    }

    const contacts = await contactsRes.json()
    const prayers = await prayersRes.json()

    // Log for debugging
    console.log('Fetched contacts:', contacts.length, 'prayers:', prayers.length)

    return NextResponse.json({
      success: true,
      contacts: Array.isArray(contacts) ? contacts : [],
      prayers: Array.isArray(prayers) ? prayers : [],
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
