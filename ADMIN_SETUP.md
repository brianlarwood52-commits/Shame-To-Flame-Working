# Admin Page Setup

## Get Your Service Role Key (Required for Admin Access)

The admin page needs a **service_role key** to read encrypted messages (it bypasses RLS security).

### Steps:

1. Go to your Supabase Dashboard
2. Click **Settings** → **API** (in the left sidebar)
3. Scroll down to find **"service_role" key** (this is different from the anon key)
4. **IMPORTANT:** This key has full access - never expose it to the client/browser!
5. Copy the service_role key

### Add to .env.local:

Add this line to your `.env.local` file (server-side only, not NEXT_PUBLIC):

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Never commit this to Git!** It's a secret key.

## How It Works

- The admin API route uses the service_role key (server-side only)
- This bypasses RLS so admin can read encrypted messages
- The key never goes to the browser - it stays on the server
