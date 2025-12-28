import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Find subscription by token
    const { data: subscription, error: fetchError } = await supabase
      .from('verse_of_day_subscriptions')
      .select('id, email, subscribed')
      .eq('unsubscribe_token', token)
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe link' },
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

    // Return HTML page for user-friendly unsubscribe confirmation
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed - Verse of the Day</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #fef3e2 0%, #e0f2fe 100%);
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
    }
    h1 { color: #ea580c; margin-bottom: 1rem; }
    p { color: #666; line-height: 1.6; }
    .success { color: #059669; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✓ Unsubscribed</h1>
    <p class="success">You have been successfully unsubscribed from Verse of the Day emails.</p>
    <p>We're sorry to see you go. If you change your mind, you can always subscribe again on our website.</p>
    <p style="margin-top: 2rem; font-size: 0.9rem; color: #999;">
      <a href="/" style="color: #ea580c; text-decoration: none;">Return to Shame to Flame</a>
    </p>
  </div>
</body>
</html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process unsubscribe' },
      { status: 500 }
    )
  }
}
