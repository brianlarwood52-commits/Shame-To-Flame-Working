# Database Setup Guide

This guide will help you set up your Supabase database with encryption and privacy-first message storage.

## Prerequisites

1. **Supabase Account**: Sign up at https://supabase.com (free tier is fine)
2. **Supabase CLI** (optional, for local dev): `npm install -g supabase`

## Option A: Cloud Supabase (Recommended for Production)

### Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: `shame-to-flame` (or your choice)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your users
4. Wait ~2 minutes for project to initialize

### Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 3: Run Migrations

You have two options:

#### Option 3a: Via Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Open `supabase/migrations/20251207011123_create_contact_and_prayer_tables.sql`
3. Copy the entire file content
4. Paste into SQL Editor and click **Run**
5. Repeat for `supabase/migrations/20251218093000_encrypt_messages_and_fix_rls.sql`

#### Option 3b: Via Supabase CLI (If you have it installed)

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### Step 4: Generate Encryption Key

Run this PowerShell command to generate a secure 32-byte key:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$b64 = [Convert]::ToBase64String($bytes)
Write-Host "MESSAGE_ENCRYPTION_KEY_B64=$b64"
```

**Save this key securely!** You'll need it for your Edge Functions.

### Step 5: Set Environment Variables

#### For Next.js App (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### For Supabase Edge Functions:

1. Go to **Settings** → **Edge Functions** → **Secrets**
2. Add these secrets:
   - `MESSAGE_ENCRYPTION_KEY_B64` = (the key you generated in Step 4)
   - `SUPABASE_URL` = (your project URL)
   - `SUPABASE_ANON_KEY` = (your anon key)

### Step 6: Deploy Edge Functions

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy submit-contact
supabase functions deploy submit-prayer
```

## Option B: Local Supabase (For Development)

### Step 1: Start Local Supabase

```bash
# Initialize (first time only)
supabase init

# Start local instance
supabase start
```

This will:
- Start a local PostgreSQL database
- Start local Edge Functions runtime
- Print your local credentials

### Step 2: Run Migrations Locally

```bash
supabase db reset
```

This runs all migrations in `supabase/migrations/`

### Step 3: Set Local Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>
```

For Edge Functions, create `supabase/.env`:

```env
MESSAGE_ENCRYPTION_KEY_B64=<generate using PowerShell command above>
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=<from supabase start output>
```

## Verify Setup

### Test Database Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see:
   - `contact_submissions` (with columns: id, name, email, encrypted_message, encryption_iv, category, risk_level, flags, etc.)
   - `prayer_requests` (with columns: id, name, email, encrypted_message, encryption_iv, category, risk_level, flags, etc.)

### Test Edge Functions

1. Go to **Edge Functions** in Supabase dashboard
2. You should see:
   - `submit-contact`
   - `submit-prayer`

### Test Form Submission

1. Start your Next.js app: `npm run dev`
2. Go to `/contact` page
3. Submit a test message (you can leave name/email blank)
4. Check Supabase **Table Editor** → `contact_submissions`
5. You should see a new row with:
   - `encrypted_message` (base64 string)
   - `encryption_iv` (base64 string)
   - `category` (e.g., "general")
   - `risk_level` (e.g., "low")
   - `message` should be `null` (not storing plaintext)

## Troubleshooting

### "Missing MESSAGE_ENCRYPTION_KEY_B64"
- Make sure you added the secret in Supabase dashboard (Settings → Edge Functions → Secrets)
- For local dev, make sure `supabase/.env` exists with the key

### "Supabase is not configured"
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your Next.js dev server after adding env vars

### Migrations fail
- Make sure you run migrations in order (oldest first)
- Check Supabase dashboard → **Database** → **Migrations** to see what's already applied

## Security Notes

- **Never commit** `.env.local` or encryption keys to Git
- The encryption key must be 32 bytes (base64 encoded)
- Only authenticated Supabase users can read encrypted messages (you'll need to build an admin tool to decrypt)
- Public (anon) users can only INSERT, not read/update/delete
