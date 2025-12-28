import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  // Handle static export
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'API not available in static export' }, { status: 503 })
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    )
  }

  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Find subscription by email
    const { data: subscription, error: fetchError } = await supabase
      .from('verse_of_day_subscriptions')
      .select('id, email, subscribed')
      .eq('email', email.toLowerCase())
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'No subscription found for this email address.' },
        { status: 404 }
      )
    }

    if (!subscription.subscribed) {
      return NextResponse.json(
        { message: 'You are already unsubscribed.', alreadyUnsubscribed: true },
        { status: 200 }
      )
    }

    // Unsubscribe
    const { error: updateError } = await supabase
      .from('verse_of_day_subscriptions')
      .update({
        subscribed: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('id', subscription.id)

    if (updateError) throw updateError

    return NextResponse.json(
      { message: 'You have been successfully unsubscribed from Verse of the Day emails.' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process unsubscribe' },
      { status: 500 }
    )
  }
}
