/**
 * Seed script for Verse of the Day entries
 * 
 * Run with: npx tsx scripts/seed-verse-of-day.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('❌ ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN must be set in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// Helper to convert plain text to portable text blocks
function textToBlocks(text: string) {
  return [
    {
      _type: 'block',
      _key: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: text,
          marks: []
        }
      ],
      markDefs: []
    }
  ]
}

// Sample verses for the next 30 days
const sampleVerses = [
  {
    date: new Date().toISOString().split('T')[0], // Today
    scripture: {
      reference: 'Jeremiah 29:11',
      text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
      translation: 'NIV'
    },
    encouragingThought: 'God has a purpose for your life, even in the midst of pain. Your story is not over—there is hope and a future waiting for you.',
    tags: ['hope', 'future', 'purpose']
  },
  {
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    scripture: {
      reference: '2 Corinthians 5:17',
      text: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',
      translation: 'NIV'
    },
    encouragingThought: 'In Christ, you are a new creation. Your past does not define you. Today is a fresh start, filled with God\'s grace and transformation.',
    tags: ['new creation', 'transformation', 'grace']
  },
  {
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day 3
    scripture: {
      reference: 'Psalm 34:18',
      text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
      translation: 'NIV'
    },
    encouragingThought: 'When you feel broken and crushed, remember that God is near. He sees your pain and is ready to bring healing and restoration.',
    tags: ['healing', 'comfort', 'presence']
  },
  {
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // Day 4
    scripture: {
      reference: 'Isaiah 41:10',
      text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
      translation: 'NIV'
    },
    encouragingThought: 'Fear has no place when God is with you. He promises to strengthen, help, and uphold you through every challenge you face.',
    tags: ['courage', 'strength', 'fear']
  },
  {
    date: new Date(Date.now() + 345600000).toISOString().split('T')[0], // Day 5
    scripture: {
      reference: 'Romans 8:28',
      text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      translation: 'NIV'
    },
    encouragingThought: 'Even in your darkest moments, God is working. Trust that He can bring good from even the most painful experiences.',
    tags: ['trust', 'purpose', 'good']
  }
]

async function seedVerseOfDay() {
  console.log('🌱 Starting Verse of the Day seed...\n')

  try {
    for (const verse of sampleVerses) {
      const document = {
        _type: 'verseOfTheDay',
        date: verse.date,
        scripture: verse.scripture,
        encouragingThought: textToBlocks(verse.encouragingThought),
        tags: verse.tags,
        featured: false
      }

      // Check if verse for this date already exists
      const existing = await client.fetch(
        `*[_type == "verseOfTheDay" && date == $date][0]`,
        { date: verse.date }
      )

      if (existing) {
        console.log(`⏭️  Verse for ${verse.date} already exists, skipping...`)
        continue
      }

      const result = await client.create(document)
      console.log(`✅ Created verse for ${verse.date}: ${verse.scripture.reference}`)
    }

    console.log('\n✨ Verse of the Day seed completed successfully!')
    console.log(`\n📝 Created ${sampleVerses.length} verse entries`)
    console.log('\n💡 Tip: You can add more verses in Sanity Studio at /my-studio')
  } catch (error: any) {
    console.error('❌ Error seeding verses:', error.message)
    if (error.details) {
      console.error('Details:', error.details)
    }
    process.exit(1)
  }
}

// Run the seed
seedVerseOfDay().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
