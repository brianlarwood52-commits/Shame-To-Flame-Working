# Verse of the Day Setup Guide

## Overview
The Verse of the Day feature displays a daily Bible verse with an encouraging thought on the homepage, with email subscription functionality for daily delivery.

## What Was Created

### 1. Sanity CMS Schema
- **File**: `sanity/schemaTypes/verseOfTheDay.ts`
- **Fields**:
  - `date`: The date this verse should be displayed
  - `scripture`: Object with `reference`, `text`, and `translation`
  - `encouragingThought`: Portable text (rich text) for the daily thought
  - `tags`: Array of tags for categorization
  - `featured`: Boolean to mark featured verses

### 2. React Component
- **File**: `src/components/VerseOfTheDay.tsx`
- **Features**:
  - Fetches today's verse from Sanity
  - Falls back to most recent featured verse if today's not available
  - Displays verse reference, text, and encouraging thought
  - Email subscription form
  - Responsive design with dark mode support

### 3. API Routes
- **Subscribe**: `app/api/verse-of-day/subscribe/route.ts`
  - Handles email subscription
  - Checks for existing subscriptions
  - Supports resubscription
- **Unsubscribe**: `app/api/verse-of-day/unsubscribe/route.ts`
  - Handles unsubscribe via token
  - Returns user-friendly HTML confirmation page

### 4. Database
- **Migration**: `supabase/migrations/20251220180000_create_verse_of_day_subscriptions.sql`
- **Table**: `verse_of_day_subscriptions`
  - Stores email addresses
  - Tracks subscription status
  - Generates unique unsubscribe tokens
  - Includes timestamps for subscription/unsubscription

### 5. Seed Script
- **File**: `scripts/seed-verse-of-day.ts`
- Creates 5 sample verses for the next 5 days
- Can be run with: `npx tsx scripts/seed-verse-of-day.ts`

## Setup Instructions

### 1. Run Database Migration
```bash
# Apply the Supabase migration
supabase migration up
# Or apply manually in Supabase Dashboard
```

### 2. Add Schema to Sanity
The schema is already added to `sanity/schemaTypes/index.ts`. After restarting your dev server, you should see "Verse of the Day" in Sanity Studio at `/my-studio`.

### 3. Seed Initial Verses
```bash
npx tsx scripts/seed-verse-of-day.ts
```

### 4. Add Verses in Sanity Studio
1. Go to `/my-studio`
2. Click "Verse of the Day" in the sidebar
3. Click "Create new"
4. Fill in:
   - **Date**: Select the date (YYYY-MM-DD format)
   - **Scripture Reference**: e.g., "John 3:16"
   - **Verse Text**: The full text of the verse
   - **Translation**: e.g., "KJV", "NIV", "ESV"
   - **Encouraging Thought**: Write your daily thought (supports rich text)
   - **Tags**: Add relevant tags (optional)
   - **Featured**: Check if you want this to be a featured verse

### 5. Test the Component
- Visit the homepage (`/`)
- You should see the Verse of the Day section
- Test the email subscription form
- Check that today's verse displays correctly

## Email Subscription Flow

### Current Implementation
- Users can subscribe via the homepage form
- Subscriptions are stored in Supabase
- Unsubscribe tokens are generated automatically

### TODO: Email Delivery
To complete the email delivery feature, you'll need to:

1. **Create Email Template** (using Resend):
   - Design HTML email template
   - Include verse, reference, and encouraging thought
   - Add unsubscribe link with token

2. **Create Daily Email Job**:
   - Set up a cron job or scheduled function
   - Fetch today's verse from Sanity
   - Query active subscriptions from Supabase
   - Send emails via Resend API
   - Update `last_sent_at` timestamp

3. **Example Email Sending Function**:
```typescript
// supabase/functions/send-verse-of-day/index.ts
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Fetch today's verse
// Query subscriptions where subscribed = true
// Send emails with unsubscribe links
```

## Unsubscribe Process

1. User clicks unsubscribe link in email: `/api/verse-of-day/unsubscribe?token={token}`
2. System finds subscription by token
3. Updates `subscribed` to `false`
4. Sets `unsubscribed_at` timestamp
5. Displays confirmation page

## Future Enhancements

1. **Email Delivery**: Implement daily email sending
2. **Email Preferences**: Allow users to choose frequency (daily/weekly)
3. **Verse Archive**: Create archive page showing past verses
4. **Social Sharing**: Add share buttons for verses
5. **Multiple Translations**: Allow users to choose preferred translation
6. **Personalization**: Customize verses based on user preferences/tags

## Database Schema

```sql
verse_of_day_subscriptions
├── id (uuid, primary key)
├── email (text, unique, required)
├── subscribed (boolean, default true)
├── unsubscribe_token (uuid, unique)
├── subscribed_at (timestamptz)
├── unsubscribed_at (timestamptz, nullable)
├── last_sent_at (timestamptz, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

## Notes

- The component automatically fetches today's verse based on the date field
- If no verse exists for today, it falls back to the most recent featured verse
- All dates should be in YYYY-MM-DD format
- The subscription form validates email addresses
- Unsubscribe tokens are UUIDs for security

## Troubleshooting

**Verse not showing?**
- Check that a verse exists for today's date in Sanity
- Check browser console for errors
- Verify Sanity client configuration

**Subscription not working?**
- Check Supabase connection
- Verify migration was applied
- Check API route logs

**Schema not appearing in Sanity?**
- Restart dev server
- Check `sanity/schemaTypes/index.ts` includes `verseOfTheDay`
- Clear Sanity Studio cache
