/**
 * Service to fetch reading plans from Sanity CMS
 * Falls back to static data if Sanity is not available
 */

import { client } from '../../sanity/lib/client'
import { ReadingPlan, DailyReading, ScriptureReference } from '../data/readingPlans'
import { readingPlans as staticPlans } from '../data/readingPlans'

interface SanityScriptureReference {
  book: string
  chapter: number
  verse?: number
  startVerse?: number
  endVerse?: number
}

interface SanityDailyReading {
  _id: string
  day: number
  dayTitle?: string
  devotional: any[] // Portable text blocks
  scripture: SanityScriptureReference[]
}

interface SanityReadingPlan {
  _id: string
  planId: string
  title: string
  description: string
  duration: number
  category: string
  sdaAligned: boolean
  featured?: boolean
  readings: SanityDailyReading[]
}

/**
 * Convert Sanity portable text to plain text
 */
function portableTextToPlainText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) => {
      return block.children
        ?.filter((child: any) => child._type === 'span')
        .map((child: any) => child.text)
        .join('') || ''
    })
    .filter((text) => text.trim())
    .join('\n\n')
}

/**
 * Convert Sanity scripture reference to app format
 */
function convertScriptureReference(ref: SanityScriptureReference): ScriptureReference {
  return {
    book: ref.book,
    chapter: ref.chapter,
    ...(ref.verse && { verse: ref.verse }),
    ...(ref.startVerse && { startVerse: ref.startVerse }),
    ...(ref.endVerse && { endVerse: ref.endVerse }),
  }
}

/**
 * Convert Sanity daily reading to app format
 */
function convertDailyReading(reading: SanityDailyReading): DailyReading {
  return {
    day: reading.day,
    dayTitle: reading.dayTitle,
    devotional: portableTextToPlainText(reading.devotional),
    scripture: reading.scripture.map(convertScriptureReference),
  }
}

/**
 * Convert Sanity reading plan to app format
 */
function convertReadingPlan(plan: SanityReadingPlan): ReadingPlan {
  return {
    id: plan.planId,
    title: plan.title,
    description: plan.description,
    duration: plan.duration,
    category: plan.category as ReadingPlan['category'],
    sdaAligned: plan.sdaAligned,
    featured: plan.featured,
    readings: plan.readings.map(convertDailyReading),
  }
}

/**
 * Fetch all reading plans from Sanity
 */
export async function getReadingPlansFromSanity(): Promise<ReadingPlan[]> {
  try {
    const query = `*[_type == "readingPlan"] | order(title asc) {
      _id,
      planId,
      title,
      description,
      duration,
      category,
      sdaAligned,
      featured,
      "readings": readings[]-> {
        _id,
        day,
        dayTitle,
        devotional,
        scripture
      } | order(day asc)
    }`

    const plans: SanityReadingPlan[] = await client.fetch(query)

    if (!plans || plans.length === 0) {
      console.warn('No reading plans found in Sanity, falling back to static data')
      return staticPlans
    }

    return plans.map(convertReadingPlan)
  } catch (error) {
    console.error('Error fetching reading plans from Sanity:', error)
    console.warn('Falling back to static data')
    return staticPlans
  }
}

/**
 * Fetch a specific reading plan by ID from Sanity
 */
export async function getReadingPlanByIdFromSanity(planId: string): Promise<ReadingPlan | null> {
  try {
    const query = `*[_type == "readingPlan" && planId == $planId][0] {
      _id,
      planId,
      title,
      description,
      duration,
      category,
      sdaAligned,
      featured,
      "readings": readings[]-> {
        _id,
        day,
        dayTitle,
        devotional,
        scripture
      } | order(day asc)
    }`

    const plan: SanityReadingPlan | null = await client.fetch(query, { planId })

    if (!plan) {
      // Fallback to static data
      return staticPlans.find((p) => p.id === planId) || null
    }

    return convertReadingPlan(plan)
  } catch (error) {
    console.error('Error fetching reading plan from Sanity:', error)
    // Fallback to static data
    return staticPlans.find((p) => p.id === planId) || null
  }
}

/**
 * Get reading plans (tries Sanity first, falls back to static)
 */
export async function getReadingPlans(): Promise<ReadingPlan[]> {
  // Try Sanity first
  const sanityPlans = await getReadingPlansFromSanity()
  
  // If we got plans from Sanity, use them
  if (sanityPlans.length > 0 && sanityPlans[0].id !== staticPlans[0].id) {
    return sanityPlans
  }
  
  // Otherwise use static data
  return staticPlans
}
