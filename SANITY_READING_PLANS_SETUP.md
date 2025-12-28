# Sanity Reading Plans Setup Guide

This guide will help you set up Sanity CMS for managing reading plans with SDA-aligned devotional content.

## Prerequisites

1. Sanity project already configured (you have this)
2. Sanity Studio accessible at `/my-studio`

## Step 1: Create Sanity API Token

1. Go to [Sanity Manage](https://sanity.io/manage)
2. Select your project
3. Navigate to **API** > **Tokens**
4. Click **Add API token**
5. Name it "Reading Plans Seeder" or similar
6. Set permissions to **Editor** (needs write access)
7. Copy the token

## Step 2: Add Token to Environment

Add the token to your `.env.local` file:

```env
SANITY_API_TOKEN=your_token_here
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Step 3: Install Dependencies (if needed)

The seeding script uses `tsx` to run TypeScript. Install it if you don't have it:

```bash
npm install -D tsx
```

## Step 4: Seed the First Reading Plan

Run the seeding script to populate Sanity with the "Healing from Shame: 30-Day Journey" plan:

```bash
npx tsx scripts/seed-reading-plans.ts
```

This will:
- Create 10 daily reading documents (days 1-10 are complete)
- Create the reading plan document
- Link everything together

## Step 5: Complete Remaining Days

The script currently seeds days 1-10 with complete SDA-aligned content. To complete the remaining 20 days:

1. Go to `/my-studio`
2. Navigate to **Daily Reading** documents
3. Create new documents for days 11-30
4. Or update `scripts/reading-plan-content.ts` with all 30 days and re-run the seed script

## Step 6: Update App to Use Sanity (Optional)

The app currently uses static data. To switch to Sanity:

1. Update `src/data/readingPlans.ts` to fetch from Sanity
2. Or use the helper functions in `src/lib/sanity-reading-plans.ts`

Example:

```typescript
import { getReadingPlans } from '@/lib/sanity-reading-plans'

// In your component
const plans = await getReadingPlans()
```

## Content Structure

Each daily reading includes:

- **Day Number**: Sequential day (1-30)
- **Day Title**: Optional title (e.g., "Day 1: God Sees You")
- **Devotional**: Rich text content with SDA-aligned perspectives
- **Scripture References**: Array of Bible references
  - Single verse: `{ book: 'COL', chapter: 1, verse: 13 }`
  - Verse range: `{ book: 'JER', chapter: 29, startVerse: 11, endVerse: 14 }`
  - Full chapter: `{ book: 'PSA', chapter: 23 }`

## Content Principles

The devotional content follows these biblical principles:

1. **Wholeness**: Addresses body, mind, and spirit
2. **Biblical Foundation**: Rooted in Scripture
3. **Restoration**: Emphasizes God's healing and restoration
4. **Community**: Acknowledges the importance of safe community
5. **Sabbath Rest**: Incorporates principles of rest and restoration
6. **Health Message**: Aligns with biblical health principles where relevant
7. **Hope**: Points to Christ's return and ultimate restoration

## Adding More Plans

To add more reading plans:

1. Create content in `scripts/reading-plan-content.ts`
2. Add a seeding function in `scripts/seed-reading-plans.ts`
3. Run the seed script
4. Or manually create in Sanity Studio

## Troubleshooting

### "SANITY_API_TOKEN not found"
- Make sure you've added the token to `.env.local`
- Restart your dev server after adding environment variables

### "Permission denied"
- Check that your token has Editor permissions
- Verify the project ID and dataset are correct

### Content not showing
- Check that documents are published in Sanity
- Verify the GROQ query in `sanity-reading-plans.ts`
- Check browser console for errors

## Next Steps

1. ✅ Complete days 11-30 for "Healing from Shame"
2. Create content for other plans (Daniel, Revelation, etc.)
3. Switch app to fetch from Sanity
4. Add image support for plans (optional)
5. Set up preview/deployment workflow
