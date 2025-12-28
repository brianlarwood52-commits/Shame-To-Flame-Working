/**
 * Script to fix missing _key properties in reading plan references
 * Run with: npx tsx scripts/fix-reading-plan-keys.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@sanity/client'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rwfrkr9i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function fixReadingPlanKeys() {
  console.log('🔧 Fixing missing keys in reading plan...')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ ERROR: SANITY_API_TOKEN not found')
    process.exit(1)
  }

  try {
    // Fetch the reading plan
    const query = `*[_type == "readingPlan" && planId == "healing-from-shame-30"][0]`
    const plan = await client.fetch(query)

    if (!plan) {
      console.error('❌ Reading plan not found')
      process.exit(1)
    }

    console.log(`Found plan: ${plan.title}`)
    console.log(`Current readings count: ${plan.readings?.length || 0}`)

    // Add _key to each reference
    const readingsWithKeys = (plan.readings || []).map((reading: any, index: number) => ({
      ...reading,
      _key: reading._key || `reading-${index + 1}`,
    }))

    // Update the document
    await client
      .patch(plan._id)
      .set({ readings: readingsWithKeys })
      .commit()

    console.log('✅ Successfully fixed reading plan keys!')
    console.log(`   Added keys to ${readingsWithKeys.length} readings`)
  } catch (error: any) {
    console.error('❌ Error fixing keys:', error.message)
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.body, null, 2))
    }
    process.exit(1)
  }
}

fixReadingPlanKeys()
