/**
 * Script to fix missing _key properties in daily reading documents
 * Run with: npx tsx scripts/fix-daily-reading-keys.ts
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

async function fixDailyReadingKeys() {
  console.log('🔧 Fixing missing keys in daily reading documents...')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ ERROR: SANITY_API_TOKEN not found')
    process.exit(1)
  }

  try {
    // Fetch all daily readings
    const query = `*[_type == "dailyReading"] | order(day asc)`
    const readings = await client.fetch(query)

    if (!readings || readings.length === 0) {
      console.error('❌ No daily readings found')
      process.exit(1)
    }

    console.log(`Found ${readings.length} daily readings`)

    let fixed = 0
    for (const reading of readings) {
      let needsUpdate = false
      const updates: any = {}

      // Fix devotional blocks
      if (reading.devotional && Array.isArray(reading.devotional)) {
        const fixedDevotional = reading.devotional.map((block: any, index: number) => {
          if (!block._key) {
            needsUpdate = true
            return {
              ...block,
              _key: `block-${index + 1}`,
              children: (block.children || []).map((child: any, childIndex: number) => ({
                ...child,
                _key: child._key || `span-${index + 1}-${childIndex + 1}`,
              })),
              markDefs: block.markDefs || [],
            }
          }
          // Also fix children keys
          const hasMissingChildKeys = block.children?.some((c: any) => !c._key)
          if (hasMissingChildKeys) {
            needsUpdate = true
            return {
              ...block,
              children: block.children.map((child: any, childIndex: number) => ({
                ...child,
                _key: child._key || `span-${index + 1}-${childIndex + 1}`,
              })),
            }
          }
          return block
        })
        if (needsUpdate) {
          updates.devotional = fixedDevotional
        }
      }

      // Fix scripture references
      if (reading.scripture && Array.isArray(reading.scripture)) {
        const fixedScripture = reading.scripture.map((ref: any, index: number) => {
          if (!ref._key) {
            needsUpdate = true
            return {
              ...ref,
              _key: `scripture-${index + 1}`,
            }
          }
          return ref
        })
        if (needsUpdate) {
          updates.scripture = fixedScripture
        }
      }

      if (needsUpdate) {
        await client.patch(reading._id).set(updates).commit()
        fixed++
        console.log(`  ✓ Fixed Day ${reading.day}: ${reading.dayTitle || 'Untitled'}`)
      }
    }

    console.log(`\n✅ Successfully fixed ${fixed} daily reading documents!`)
  } catch (error: any) {
    console.error('❌ Error fixing keys:', error.message)
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.body, null, 2))
    }
    process.exit(1)
  }
}

fixDailyReadingKeys()
