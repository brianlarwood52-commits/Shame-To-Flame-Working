# 🚀 Deploy to VentraIP - Step by Step Guide

## ✅ Build Status: READY!

Your site has been successfully built! The `out` folder contains everything you need.

## 📦 What's Ready

- ✅ All public pages (home, bible-study, contact, etc.)
- ✅ All images, videos, and assets
- ✅ PWA manifest and service worker
- ✅ Optimized JavaScript and CSS
- ✅ Static HTML files ready for hosting

## 🎯 Deployment Steps

### Step 1: Prepare Files

1. Navigate to: `c:\Users\miami\OneDrive\Documents\GitHub\new-mainxx\out\`
2. **Select ALL files and folders** inside the `out` directory
3. Create a ZIP file (optional but recommended for faster upload)

### Step 2: Upload to VentraIP

#### Option A: Using cPanel File Manager (Easiest)

1. **Log into VentraIP cPanel**
2. **Open File Manager**
3. **Navigate to `public_html`** (or `www` - this is your website root)
4. **Delete any existing files** (if this is your first deployment)
5. **Upload your files:**
   - If you created a ZIP: Upload the ZIP, then right-click → Extract
   - If uploading directly: Upload all files and folders from the `out` directory
6. **Important:** Make sure `index.html` is in the root of `public_html`

#### Option B: Using FTP (Alternative)

1. **Use an FTP client** (FileZilla, WinSCP, etc.)
2. **Connect to your VentraIP FTP server**
3. **Navigate to `public_html`**
4. **Upload all contents** of the `out` folder

### Step 3: Verify Deployment

1. **Visit your domain:** `https://shametoflame.faith`
2. **Test key pages:**
   - Homepage loads
   - Bible Study page works
   - Contact form displays
   - Navigation works

## ⚠️ What Works vs. What Doesn't

### ✅ WILL WORK on VentraIP (Static Hosting)

- ✅ All public pages
- ✅ Bible Study page with reading plans
- ✅ Offline KJV Bible (IndexedDB - browser storage)
- ✅ Progress tracking (stored in browser)
- ✅ Contact form (uses Supabase Edge Functions - works!)
- ✅ Prayer request form (uses Supabase Edge Functions - works!)
- ✅ Daily Fire devotionals
- ✅ All navigation and UI
- ✅ PWA features (offline mode)

### ❌ WON'T WORK on VentraIP (Needs Server)

- ❌ Admin dashboard (`/admin`) - requires Next.js API routes
- ❌ Sanity Studio (`/my-studio`) - requires Node.js server
- ❌ Verse of the Day email subscription - API routes won't work

**Note:** The contact and prayer forms WILL work because they use Supabase Edge Functions directly from the browser, not Next.js API routes.

## 🔧 If You See Issues

### Issue: Pages show 404 or don't load
- **Solution:** Make sure `index.html` is in the root of `public_html`
- **Check:** All files from `out` folder are uploaded

### Issue: Images or assets missing
- **Solution:** Make sure you uploaded the entire `out` folder structure
- **Check:** The `_next` folder is uploaded (contains CSS/JS)

### Issue: Forms don't work
- **Solution:** Check browser console (F12) for errors
- **Note:** Forms use Supabase - make sure your Supabase project is active

### Issue: Bible Study page has errors
- **Solution:** Most errors are just console warnings - the page should still work
- **Try:** Clear browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+F5)

## 📋 Quick Checklist

- [ ] Build completed successfully (`npm run build`)
- [ ] `out` folder contains all files
- [ ] Logged into VentraIP cPanel
- [ ] Navigated to `public_html`
- [ ] Uploaded all files from `out` folder
- [ ] Verified `index.html` is in root
- [ ] Tested site at `shametoflame.faith`
- [ ] Tested key pages (home, bible-study, contact)

## 🎯 Next Steps After Deployment

1. **Test thoroughly** - Check all pages load correctly
2. **Test forms** - Submit a test contact/prayer request
3. **Test Bible Study** - Start a reading plan to verify offline features
4. **Set up custom domain** (if not already done)
5. **Configure SSL** (HTTPS) - VentraIP should provide this

## 💡 For Admin/Studio Features Later

If you need the admin dashboard or Sanity Studio later, you can:
- Deploy them separately to Vercel (free) or Netlify
- Use a subdomain like `admin.shametoflame.faith`
- Or set up a separate Node.js server

## 📞 Need Help?

If you encounter issues:
1. Check the browser console (F12) for errors
2. Verify all files uploaded correctly
3. Check VentraIP support documentation
4. Ensure your domain DNS is pointing to VentraIP

---

**Your site is ready to go live!** 🎉

Just upload the `out` folder contents to VentraIP and you're done!
