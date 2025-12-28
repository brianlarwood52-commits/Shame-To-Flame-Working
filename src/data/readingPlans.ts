export interface ReadingPlan {
  id: string
  title: string
  description: string
  duration: number // days
  category: 'healing' | 'prophecy' | 'sabbath' | 'health' | 'new-believer' | 'advent' | 'character' | 'topical'
  sdaAligned: boolean
  featured?: boolean
  readings: DailyReading[]
}

export interface ScriptureReference {
  book: string // Bible book ID (e.g., 'GEN', 'PSA', 'COL')
  chapter: number
  verse?: number // Single verse (e.g., Colossians 1:13)
  startVerse?: number // Verse range start
  endVerse?: number // Verse range end
}

export interface DailyReading {
  day: number
  dayTitle?: string // Optional day title (e.g., "Day 1: Finding Hope")
  devotional: string // Main devotional content (can be multiple paragraphs, separated by \n\n)
  scripture: ScriptureReference[] // Array of scripture references for this day
}

export const readingPlans: ReadingPlan[] = [
  {
    id: 'healing-from-shame-30',
    title: 'Healing from Shame: 30-Day Journey',
    description: 'A Scripture-based journey to find freedom from shame through God\'s Word. Discover God\'s love and acceptance in Psalms, Isaiah, and the Gospels.',
    duration: 30,
    category: 'healing',
    sdaAligned: true,
    featured: true,
    readings: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} devotional content - to be completed with full devotional text including multiple paragraphs of reflection, encouragement, and biblical insights.`,
      scripture: [
        {
          book: i < 10 ? 'PSA' : i < 20 ? 'ISA' : 'ROM',
          chapter: Math.floor(i / 3) + 1,
          startVerse: 1,
          endVerse: 10
        }
      ]
    }))
  },
  {
    id: 'daniel-prophecies-70',
    title: 'Daniel\'s Prophecies: 70-Day Study',
    description: 'A comprehensive study of the book of Daniel, exploring the prophecies that point to Christ and the end times. Essential for understanding SDA prophetic interpretation.',
    duration: 70,
    category: 'prophecy',
    sdaAligned: true,
    featured: true,
    readings: Array.from({ length: 70 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Daniel study devotional - to be completed with full devotional text.`,
      scripture: [{
        book: 'DAN',
        chapter: Math.min(Math.floor(i / 2) + 1, 12),
        startVerse: 1,
        endVerse: 20
      }]
    }))
  },
  {
    id: 'revelation-unveiled-22',
    title: 'Revelation Unveiled: 22-Day Journey',
    description: 'Chapter by chapter study of Revelation, understanding the symbols, prophecies, and the ultimate victory of Christ. Aligned with SDA interpretation.',
    duration: 22,
    category: 'prophecy',
    sdaAligned: true,
    featured: true,
    readings: Array.from({ length: 22 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Revelation study devotional - to be completed with full devotional text.`,
      scripture: [{
        book: 'REV',
        chapter: i + 1,
        startVerse: 1,
        endVerse: i === 0 ? 20 : 30
      }]
    }))
  },
  {
    id: 'sabbath-rest-12weeks',
    title: 'Sabbath Rest & Restoration: 12-Week Study',
    description: 'Explore the biblical foundation of Sabbath, its meaning, and how to experience true rest in God. Perfect for deepening your understanding of the fourth commandment.',
    duration: 84, // 12 weeks
    category: 'sabbath',
    sdaAligned: true,
    featured: false,
    readings: Array.from({ length: 84 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Sabbath study devotional - to be completed with full devotional text.`,
      scripture: [{
        book: i < 28 ? 'GEN' : i < 56 ? 'EXO' : 'HEB',
        chapter: Math.floor(i / 3) + 1,
        startVerse: 1,
        endVerse: 15
      }]
    }))
  },
  {
    id: 'finding-hope-grief-21',
    title: 'Finding Hope in Grief: 21-Day Journey',
    description: 'Scripture passages that bring comfort and hope during times of loss and grief. Discover God\'s presence in your darkest moments.',
    duration: 21,
    category: 'healing',
    sdaAligned: true,
    featured: false,
    readings: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Finding hope in grief devotional - to be completed with full devotional text.`,
      scripture: [{
        book: i < 7 ? 'PSA' : i < 14 ? 'ECC' : 'REV',
        chapter: Math.floor(i / 3) + 1,
        startVerse: 1,
        endVerse: 10
      }]
    }))
  },
  {
    id: 'three-angels-messages-14',
    title: 'The Three Angels\' Messages: 14-Day Study',
    description: 'Deep dive into Revelation 14:6-12, understanding the three angels\' messages that are central to SDA belief and mission.',
    duration: 14,
    category: 'prophecy',
    sdaAligned: true,
    featured: false,
    readings: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Three angels' messages study devotional - to be completed with full devotional text.`,
      scripture: [{
        book: 'REV',
        chapter: 14,
        startVerse: i < 5 ? 6 : i < 10 ? 8 : 9,
        endVerse: i < 5 ? 7 : i < 10 ? 8 : 12
      }]
    }))
  },
  {
    id: 'gods-health-principles-30',
    title: 'God\'s Health Principles: 30-Day Study',
    description: 'Explore biblical principles of health and wellness, including the SDA health message. Learn how to honor God with your body as His temple.',
    duration: 30,
    category: 'health',
    sdaAligned: true,
    featured: false,
    readings: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Health principles devotional - to be completed with full devotional text.`,
      scripture: [{
        book: i < 10 ? '1CO' : i < 20 ? 'LEV' : 'DAN',
        chapter: Math.floor(i / 3) + 1,
        startVerse: 1,
        endVerse: 15
      }]
    }))
  },
  {
    id: 'first-steps-faith-30',
    title: 'First Steps in Faith: 30-Day Plan for New Believers',
    description: 'Perfect for those new to faith or returning to God. Cover the basics of salvation, prayer, and walking with Jesus day by day.',
    duration: 30,
    category: 'new-believer',
    sdaAligned: true,
    featured: false,
    readings: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - First steps in faith devotional - to be completed with full devotional text.`,
      scripture: [{
        book: i < 10 ? 'JHN' : i < 20 ? 'ROM' : 'EPH',
        chapter: Math.floor(i / 3) + 1,
        startVerse: 1,
        endVerse: 15
      }]
    }))
  },
  {
    id: 'overcoming-trauma-40',
    title: 'Overcoming Trauma: 40-Day Healing Journey',
    description: 'Scripture passages that address trauma, PTSD, and deep wounds. Follow the stories of Joseph, Job, and Jesus\' healing ministry.',
    duration: 40,
    category: 'healing',
    sdaAligned: true,
    featured: false,
    readings: Array.from({ length: 40 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Overcoming trauma devotional - to be completed with full devotional text.`,
      scripture: [{
        book: i < 20 ? 'GEN' : 'JOB',
        chapter: Math.floor(i / 2) + 1,
        startVerse: 1,
        endVerse: 20
      }]
    }))
  },
  {
    id: 'psalms-comfort-31',
    title: 'Psalms for Comfort: 31-Day Journey',
    description: 'A month-long journey through the Psalms, focusing on passages that bring comfort, hope, and healing to the brokenhearted.',
    duration: 31,
    category: 'healing',
    sdaAligned: true,
    featured: false,
    readings: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      dayTitle: `Day ${i + 1}`,
      devotional: `Day ${i + 1} - Psalms for comfort devotional - to be completed with full devotional text.`,
      scripture: [{
        book: 'PSA',
        chapter: Math.min(i + 1, 150),
        startVerse: 1,
        endVerse: 10
      }]
    }))
  }
]

// Helper functions
export function getPlanById(id: string): ReadingPlan | undefined {
  return readingPlans.find(plan => plan.id === id)
}

export function getPlansByCategory(category: ReadingPlan['category']): ReadingPlan[] {
  return readingPlans.filter(plan => plan.category === category)
}

export function getFeaturedPlans(): ReadingPlan[] {
  return readingPlans.filter(plan => plan.featured)
}

export function getAllCategories(): ReadingPlan['category'][] {
  return Array.from(new Set(readingPlans.map(plan => plan.category)))
}
