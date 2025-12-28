/**
 * Script to seed Sanity with reading plan data
 * 
 * SETUP:
 * 1. Create a Sanity API token with write permissions:
 *    - Go to https://sanity.io/manage
 *    - Select your project
 *    - Go to API > Tokens
 *    - Create a new token with Editor permissions
 * 
 * 2. Add the token to your .env.local:
 *    SANITY_API_TOKEN=your_token_here
 * 
 * 3. Run the script:
 *    npx tsx scripts/seed-reading-plans.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@sanity/client'
import { healingFromShameContent, textToBlocks } from './reading-plan-content'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '601dSpd7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Required for write operations
})

async function seedHealingFromShamePlan() {
  console.log('🌱 Seeding "Healing from Shame: 30-Day Journey"...')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ ERROR: SANITY_API_TOKEN not found in environment variables')
    console.error('   Please create a token in Sanity and add it to .env.local')
    process.exit(1)
  }

  try {
    const dailyReadingIds: string[] = []

    // Create all daily readings
    for (const reading of healingFromShameContent) {
      const scriptureRefs = reading.scripture.map((ref, index) => ({
        _type: 'scriptureReference',
        _key: `scripture-${index + 1}`,
        book: ref.book,
        chapter: ref.chapter,
        ...(ref.verse && { verse: ref.verse }),
        ...(ref.startVerse && { startVerse: ref.startVerse }),
        ...(ref.endVerse && { endVerse: ref.endVerse }),
      }))

      const doc = {
        _type: 'dailyReading',
        day: reading.day,
        dayTitle: reading.dayTitle,
        devotional: textToBlocks(reading.devotional),
        scripture: scriptureRefs,
      }

      const result = await client.create(doc)
      dailyReadingIds.push(result._id)
      console.log(`  ✓ Created day ${reading.day}: ${reading.dayTitle}`)
    }

    // Create the reading plan
    const planDoc = {
      _type: 'readingPlan',
      planId: 'healing-from-shame-30',
      title: 'Healing from Shame: 30-Day Journey',
      description:
        'A Scripture-based journey to find freedom from shame through God\'s Word. Discover God\'s love and acceptance in Psalms, Isaiah, and the Gospels. This plan emphasizes the wholeness of healing—body, mind, and spirit.',
      duration: 30,
      category: 'healing',
      sdaAligned: true,
      featured: true,
      readings: dailyReadingIds.map((id, index) => ({
        _type: 'reference',
        _ref: id,
        _key: `reading-${index + 1}`,
      })),
    }

    await client.create(planDoc)
    console.log('  ✓ Created reading plan document')

    console.log('✅ Successfully seeded "Healing from Shame: 30-Day Journey"!')
    return { planId: 'healing-from-shame-30', readingIds: dailyReadingIds }
  } catch (error: any) {
    console.error('❌ Error seeding plan:', error.message)
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.body, null, 2))
    }
    throw error
  }
}

async function seedReadingPlans() {
  console.log('🚀 Starting to seed reading plans...\n')

  try {
    await seedHealingFromShamePlan()
    
    // Add more plans here as you create content for them
    // await seedDanielPropheciesPlan()
    // await seedRevelationUnveiledPlan()
    // etc.

    console.log('\n🎉 All reading plans seeded successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Go to /my-studio to view your content in Sanity')
    console.log('   2. Update the app to fetch from Sanity (see lib/sanity-reading-plans.ts)')
    console.log('   3. Add more plans as needed')
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the script
seedReadingPlans().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

export { seedReadingPlans, seedHealingFromShamePlan }
