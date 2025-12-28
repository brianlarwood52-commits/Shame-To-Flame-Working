# Admin Area Setup for cPanel (Static Hosting)

The admin area now uses **Supabase Edge Functions** instead of Next.js API routes, so it will work on cPanel static hosting!

## ✅ What's Been Done

1. **Created 4 Supabase Edge Functions:**
   - `admin-2fa-send` - Sends 2FA code via email
   - `admin-2fa-verify` - Verifies 2FA code and creates session
   - `admin-messages` - Fetches contact submissions and prayer requests
   - `admin-decrypt` - Decrypts encrypted messages

2. **Updated Admin Component:**
   - Now calls Supabase Edge Functions instead of Next.js API routes
   - Works in static export (cPanel compatible)

## 🚀 Deployment Steps

### Step 1: Deploy Supabase Edge Functions

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all admin functions
supabase functions deploy admin-2fa-send
supabase functions deploy admin-2fa-verify
supabase functions deploy admin-messages
supabase functions deploy admin-decrypt
```

### Step 2: Set Edge Function Secrets

In your Supabase Dashboard → **Settings** → **Edge Functions** → **Secrets**, add:

```
ADMIN_EMAIL=contact@shametoflame.faith
RESEND_API_KEY=re_... (your Resend API key)
MESSAGE_ENCRYPTION_KEY_B64=... (your encryption key)
SUPABASE_URL=https://eiqvhtpnybdgsnheozgd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=... (your service role key)
```

### Step 3: Build and Deploy to cPanel

```bash
npm run build
```

Then upload the `out` folder contents to your cPanel `public_html` directory.

## 🔐 How It Works

1. **Login Flow:**
   - User enters password → `admin-2fa-send` sends code
   - User enters code → `admin-2fa-verify` validates and returns session token
   - Session token stored in browser localStorage

2. **Data Access:**
   - `admin-messages` uses service role key to bypass RLS
   - `admin-decrypt` decrypts messages using encryption key
   - Both require valid session token

## ⚠️ Important Notes

- **Session tokens are currently stored in-memory in Edge Functions** (simple implementation)
- For production, consider storing sessions in Supabase database
- The admin page will work on static hosting (cPanel) once Edge Functions are deployed
- All sensitive operations happen server-side in Supabase

## 🧪 Testing

1. Deploy Edge Functions
2. Build your site: `npm run build`
3. Test locally: `npm run dev` (admin should work)
4. Deploy `out` folder to cPanel
5. Test admin at `https://shametoflame.faith/admin`

The admin area is now fully compatible with cPanel static hosting! 🎉



