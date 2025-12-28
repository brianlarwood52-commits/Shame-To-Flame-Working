import { createClient } from 'next-sanity'
// FIXED: Importing 'devotionals' (the data), not 'Devotional' (the type)
import { devotionals } from '../src/data/dailyFireDevotionals' 

const client = createClient({
  projectId: 'rwfrkr9i',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  // Your hardcoded token
  token: 'skpAjsWfsNFk8tbPsmBm15Kfak61a0nzFo5Cdck6sry5SdSEmPF9bgDjp3VMKUYrxB9ZpZ09EH5I9YiVJivBzCBUdHF8xItQ4mbqayN2JTJ0gLLFSatN8oFUbAyztAqJxUoqRilRgx6As9ubZKQScHCeTFICpO4uCIAus4kJmfHo80gFvKRh'
})

async function migrate() {
  console.log('🔥 Starting Migration for', devotionals.length, 'posts...')

  for (const post of devotionals) {
    // Generate URL slug from title
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const doc = {
      _type: 'dailyFire',
      title: post.title,
      slug: { _type: 'slug', current: slug },
      day_number: post.id, 
      scripture: {
        reference: post.scripture.reference,
        text: post.scripture.text
      },
      message: post.message, 
      reflection: post.reflection,
      prayer: post.prayer
    }

    try {
      const result = await client.create(doc)
      console.log('✅ Uploaded:', result.title)
    } catch (err: any) {
      console.error('❌ Failed:', post.title, err.message)
    }
  }
}

migrate()