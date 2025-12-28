/**
 * Script to clean up duplicate reading plans and daily readings
 * Run with: npx tsx scripts/cleanup-duplicates.ts
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

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicates...')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ ERROR: SANITY_API_TOKEN not found')
    process.exit(1)
  }

  try {
    // Find all reading plans
    const plansQuery = `*[_type == "readingPlan"]`
    const plans = await client.fetch(plansQuery)

    console.log(`Found ${plans.length} reading plan(s)`)

    // Keep only the first one, delete the rest
    if (plans.length > 1) {
      console.log(`\n🗑️  Deleting ${plans.length - 1} duplicate reading plan(s)...`)
      for (let i = 1; i < plans.length; i++) {
        await client.delete(plans[i]._id)
        console.log(`  ✓ Deleted duplicate plan: ${plans[i].title}`)
      }
    }

    // Find all daily readings
    const readingsQuery = `*[_type == "dailyReading"] | order(day asc, _createdAt asc)`
    const allReadings = await client.fetch(readingsQuery)

    console.log(`\nFound ${allReadings.length} daily reading(s)`)

    // Group by day to find duplicates
    const readingsByDay = new Map<number, any[]>()
    for (const reading of allReadings) {
      const day = reading.day
      if (!readingsByDay.has(day)) {
        readingsByDay.set(day, [])
      }
      readingsByDay.get(day)!.push(reading)
    }

    // Keep only the first reading for each day, delete duplicates
    let deletedCount = 0
    const keptReadings: string[] = []

    for (const [day, readings] of readingsByDay.entries()) {
      if (readings.length > 1) {
        // Keep the first one (oldest)
        const toKeep = readings[0]
        keptReadings.push(toKeep._id)
        
        // Delete the rest
        for (let i = 1; i < readings.length; i++) {
          await client.delete(readings[i]._id)
          deletedCount++
          console.log(`  ✓ Deleted duplicate Day ${day} reading`)
        }
      } else {
        keptReadings.push(readings[0]._id)
      }
    }

    console.log(`\n🗑️  Deleted ${deletedCount} duplicate daily reading(s)`)

    // Now fix the reading plan to only reference the kept readings
    if (plans.length > 0) {
      const plan = plans[0]
      console.log(`\n🔧 Fixing reading plan: ${plan.title}`)

      // Get all readings for this plan (days 1-30)
      const planReadings = keptReadings
        .map((id) => allReadings.find((r) => r._id === id))
        .filter((r) => r !== undefined)
        .sort((a, b) => a!.day - b!.day)

      // Create references with proper keys
      const readingsWithKeys = planReadings.map((reading, index) => ({
        _type: 'reference',
        _ref: reading!._id,
        _key: `reading-${index + 1}`,
      }))

      // Update the plan
      await client
        .patch(plan._id)
        .set({ readings: readingsWithKeys })
        .commit()

      console.log(`  ✓ Updated plan with ${readingsWithKeys.length} readings`)
    }

    console.log('\n✅ Cleanup complete!')
    console.log(`   - Kept 1 reading plan`)
    console.log(`   - Kept ${keptReadings.length} daily readings (one per day)`)
    console.log(`   - Deleted ${deletedCount} duplicate daily readings`)
  } catch (error: any) {
    console.error('❌ Error during cleanup:', error.message)
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.body, null, 2))
    }
    process.exit(1)
  }
}

cleanupDuplicates()
