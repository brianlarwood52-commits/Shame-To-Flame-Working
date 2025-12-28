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

    // Check if email already exists
    const { data: existing } = await supabase
      .from('verse_of_day_subscriptions')
      .select('id, subscribed, unsubscribe_token')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json(
          { message: 'You are already subscribed!', alreadySubscribed: true },
          { status: 200 }
        )
      } else {
        // Resubscribe
        const { error } = await supabase
          .from('verse_of_day_subscriptions')
          .update({
            subscribed: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null
          })
          .eq('email', email.toLowerCase())

        if (error) throw error

        return NextResponse.json(
          { message: 'Successfully resubscribed!', resubscribed: true },
          { status: 200 }
        )
      }
    }

    // Create new subscription
    const { data, error } = await supabase
      .from('verse_of_day_subscriptions')
      .insert({
        email: email.toLowerCase(),
        subscribed: true
      })
      .select()
      .single()

    if (error) throw error

    // TODO: Send confirmation email with unsubscribe link
    // This would use Resend API similar to the contact form

    return NextResponse.json(
      { 
        message: 'Successfully subscribed! Check your email to confirm.',
        subscriptionId: data.id
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process subscription' },
      { status: 500 }
    )
  }
}
