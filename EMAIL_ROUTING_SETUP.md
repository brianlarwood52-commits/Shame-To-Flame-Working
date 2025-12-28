# Email Routing Setup Guide

This guide explains how to configure different email addresses for different message categories.

## How It Works

When someone submits a contact form or prayer request, the system:
1. Categorizes the message (general, prayer, bible-study, testimony, crisis)
2. Sends an email notification to the appropriate email address based on the category
3. Stores the encrypted message in the database

## Default Email Addresses

If you don't configure custom emails, these defaults are used:
- **General Questions**: `contact@shametoflame.faith`
- **Prayer Requests**: `prayer-request@shametoflame.faith`
- **Bible Study Support**: `bible-study@shametoflame.faith`
- **Testimonies**: `testimony@shametoflame.faith`
- **Crisis Support**: `crisis@shametoflame.faith`

## Setting Up Custom Email Addresses

### Step 1: Create Email Addresses in Your Email Provider

Create the email addresses you want to use in your email provider (cPanel, GoDaddy, etc.):
- `contact@shametoflame.faith` (or use your existing one)
- `bible-study@shametoflame.faith`
- `testimony@shametoflame.faith`
- `crisis@shametoflame.faith`
- `prayer-request@shametoflame.faith` (if different from default)

### Step 2: Add Environment Variables to Supabase

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Go to Edge Functions → Settings → Secrets**
   - Or go to: Project Settings → Edge Functions → Secrets

3. **Add these secrets** (only add the ones you want to customize):

   ```
   EMAIL_GENERAL=contact@shametoflame.faith
   EMAIL_PRAYER=prayer-request@shametoflame.faith
   EMAIL_BIBLE_STUDY=bible-study@shametoflame.faith
   EMAIL_TESTIMONY=testimony@shametoflame.faith
   EMAIL_CRISIS=crisis@shametoflame.faith
   ```

   **Important Notes:**
   - Only add secrets for categories where you want a different email than the default
   - If you don't add a secret, the default email for that category will be used
   - You can use the same email for multiple categories if you want

### Step 3: Redeploy Edge Functions

After adding secrets, you need to redeploy the Edge Functions so they pick up the new environment variables:

```bash
npx supabase functions deploy submit-contact
npx supabase functions deploy submit-prayer
```

Or if you're using the Supabase CLI linked to your project:

```bash
supabase functions deploy submit-contact
supabase functions deploy submit-prayer
```

## Example Configurations

### Example 1: All Categories Go to One Email
If you want all messages to go to one email address:

**Supabase Secrets:**
```
EMAIL_GENERAL=contact@shametoflame.faith
EMAIL_PRAYER=contact@shametoflame.faith
EMAIL_BIBLE_STUDY=contact@shametoflame.faith
EMAIL_TESTIMONY=contact@shametoflame.faith
EMAIL_CRISIS=contact@shametoflame.faith
```

### Example 2: Separate Emails for Each Category
If you want different emails for each category:

**Supabase Secrets:**
```
EMAIL_GENERAL=contact@shametoflame.faith
EMAIL_PRAYER=prayer@shametoflame.faith
EMAIL_BIBLE_STUDY=studies@shametoflame.faith
EMAIL_TESTIMONY=stories@shametoflame.faith
EMAIL_CRISIS=urgent@shametoflame.faith
```

### Example 3: Only Customize Some Categories
If you only want to customize a few categories:

**Supabase Secrets:**
```
EMAIL_BIBLE_STUDY=biblestudy@shametoflame.faith
EMAIL_CRISIS=urgent@shametoflame.faith
```

The rest will use defaults:
- General → `contact@shametoflame.faith`
- Prayer → `prayer-request@shametoflame.faith`
- Testimony → `testimony@shametoflame.faith`

## Testing

1. Submit a test contact form with each category
2. Check the appropriate email inbox
3. Verify the email subject includes the category: `[GENERAL]`, `[BIBLE-STUDY]`, etc.

## Email Content

The emails you receive will include:
- Category and risk level
- Sender name (or "Anonymous")
- Sender email (or "Not provided")
- Subject line
- **Note:** The actual message content is NOT included in the email (for privacy)
- You must view the decrypted message in the admin dashboard

## Troubleshooting

### Emails Not Arriving
1. Check that `RESEND_API_KEY` is set in Supabase Edge Function secrets
2. Verify your domain is verified in Resend
3. Check Supabase Edge Function logs for errors
4. Make sure you redeployed the functions after adding secrets

### Wrong Email Address Receiving Messages
1. Check your Supabase secrets are set correctly
2. Make sure you redeployed the Edge Functions after changing secrets
3. Verify the email addresses exist in your email provider

### Want to Change Email Addresses Later
1. Update the secrets in Supabase
2. Redeploy the Edge Functions
3. New submissions will use the new addresses
