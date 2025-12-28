# Resend Domain Verification Setup Guide

This guide will help you verify your `shametoflame.faith` domain in Resend so you can send emails from your own domain instead of the test domain.

## Step 1: Add Domain in Resend

1. **Go to Resend Dashboard**
   - Open your browser and go to: https://resend.com/domains
   - Make sure you're logged in to your Resend account

2. **Click "Add Domain"**
   - You should see a button or link that says "Add Domain" or "Add New Domain"
   - Click it

3. **Enter Your Domain**
   - In the domain field, enter: `shametoflame.faith`
   - **Important:** Do NOT include `www.` or `http://` - just the domain name
   - Click "Add Domain" or "Continue"

## Step 2: Get Your DNS Records

After adding the domain, Resend will show you DNS records that need to be added. You'll typically see:

1. **SPF Record** (Type: TXT)
   - Name: `@` (or sometimes `shametoflame.faith`)
   - Value: Something like `v=spf1 include:resend.com ~all`

2. **DKIM Records** (Type: TXT)
   - Usually 3 records with names like:
     - `resend._domainkey` or `resend._domainkey.shametoflame.faith`
   - Each has a long value starting with `v=DKIM1;`

3. **DMARC Record** (Type: TXT, Optional but recommended)
   - Name: `_dmarc`
   - Value: Something like `v=DMARC1; p=none;`

**📝 IMPORTANT:** Copy all these records exactly as shown. You'll need them in the next step.

## Step 3: Add DNS Records in cPanel

Since you mentioned using cPanel for your live site, here's how to add the records:

1. **Log into cPanel**
   - Go to your hosting provider's cPanel login page
   - Enter your username and password

2. **Find DNS Zone Editor**
   - In cPanel, look for "Zone Editor" or "DNS Zone Editor" or "Advanced DNS Zone Editor"
   - It's usually under the "Domains" section

3. **Select Your Domain**
   - Click on `shametoflame.faith` (or select it from a dropdown)

4. **Add Each DNS Record**

   For each record Resend provided:

   a. **Click "Add Record"** (or similar button)

   b. **Fill in the fields:**
      - **Type:** Select `TXT` (for all Resend records)
      - **Name:** Enter exactly what Resend shows (e.g., `@`, `resend._domainkey`, `_dmarc`)
      - **TTL:** Leave as default (usually 3600 or 14400)
      - **TXT Data:** Paste the entire value from Resend (the long string)

   c. **Click "Add Record"** or "Save"

   d. **Repeat** for each DNS record Resend provided

5. **Important Notes:**
   - The `@` symbol usually means "root domain" (shametoflame.faith)
   - If cPanel asks for a subdomain, leave it blank for `@` records
   - Make sure there are no extra spaces when copying/pasting the values
   - DNS records are case-sensitive, so copy exactly

## Step 4: Wait for DNS Propagation

- DNS changes can take anywhere from **5 minutes to 48 hours** to propagate
- Usually it's within 1-2 hours
- You can check status in Resend dashboard - it will show "Pending" then "Verified" when ready

## Step 5: Verify in Resend

1. **Go back to Resend Dashboard**
   - Return to: https://resend.com/domains
   - You should see your domain listed

2. **Check Status**
   - It will show "Pending Verification" initially
   - Once DNS propagates, it will change to "Verified" ✅
   - You may need to click a "Verify" or "Check Status" button

3. **If Verification Fails:**
   - Double-check that all DNS records were added correctly
   - Make sure there are no typos
   - Wait a bit longer (DNS can be slow)
   - Use a DNS checker tool like https://mxtoolbox.com/ to verify records are live

## Step 6: Update Your Code

Once your domain is verified, update the email "from" address in your code:

**File to update:** `app/api/admin/send-2fa/route.ts`

Change this line (around line 63):
```typescript
from: 'Shame to Flame Admin <onboarding@resend.dev>',
```

To:
```typescript
from: 'Shame to Flame Admin <noreply@shametoflame.faith>',
```

**Also update:** `supabase/functions/submit-prayer/index.ts`

Change the "from" address in the email sending function to use your domain.

## Troubleshooting

### DNS Records Not Showing Up
- Wait longer (up to 48 hours)
- Check that you added them to the correct domain in cPanel
- Verify the records using https://mxtoolbox.com/

### Verification Still Pending
- Make sure all required records are added (SPF, DKIM, and optionally DMARC)
- Check for typos in the record values
- Some DNS providers require you to remove quotes from TXT values - try that if needed

### Can't Find DNS Zone Editor in cPanel
- Look for "Advanced DNS Zone Editor" instead
- Or check under "Domains" → "Zone Editor"
- Contact your hosting provider if you can't find it

## Need Help?

If you get stuck:
1. Take a screenshot of the DNS records Resend shows you
2. Take a screenshot of your cPanel DNS Zone Editor
3. Share them and I can help troubleshoot

---

**Quick Checklist:**
- [ ] Added domain in Resend dashboard
- [ ] Copied all DNS records from Resend
- [ ] Added SPF record in cPanel
- [ ] Added all DKIM records in cPanel
- [ ] Added DMARC record (optional but recommended)
- [ ] Waited for DNS propagation (1-2 hours)
- [ ] Verified domain status in Resend
- [ ] Updated code to use your domain email address
