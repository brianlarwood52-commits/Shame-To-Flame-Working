/**
 * Verse of the Day Service
 * 
 * This service fetches the Verse of the Day from various sources.
 * Currently uses scripture.api.bible, but can be easily switched to YouVersion API later.
 * 
 * TODO: When YouVersion API access is granted, update this service to use:
 * - YouVersion API endpoint for daily verses
 * - YouVersion's verse of the day feature
 */

import BibleApiService from './bibleApi'

// Popular encouraging verses for rotation
const popularVerses = [
  { book: 'JER', chapter: 29, verse: 11 },
  { book: 'PSA', chapter: 23, verse: 1 },
  { book: 'JHN', chapter: 3, verse: 16 },
  { book: 'ROM', chapter: 8, verse: 28 },
  { book: 'PHP', chapter: 4, verse: 13 },
  { book: 'ISA', chapter: 41, verse: 10 },
  { book: 'PSA', chapter: 46, verse: 1 },
  { book: 'MAT', chapter: 11, verse: 28 },
  { book: '2CO', chapter: 5, verse: 17 },
  { book: 'PSA', chapter: 34, verse: 18 },
  { book: '1PE', chapter: 5, verse: 7 },
  { book: 'JOS', chapter: 1, verse: 9 },
  { book: 'PSA', chapter: 27, verse: 1 },
  { book: 'ISA', chapter: 40, verse: 31 },
  { book: 'PSA', chapter: 37, verse: 4 },
  { book: 'PRO', chapter: 3, verse: 5 },
  { book: 'PSA', chapter: 91, verse: 1 },
  { book: 'MAT', chapter: 6, verse: 26 },
  { book: 'PSA', chapter: 139, verse: 14 },
  { book: 'ROM', chapter: 12, verse: 2 },
  { book: 'EPH', chapter: 2, verse: 8 },
  { book: 'GAL', chapter: 2, verse: 20 },
  { book: 'COL', chapter: 3, verse: 23 },
  { book: 'HEB', chapter: 11, verse: 1 },
  { book: 'PSA', chapter: 119, verse: 105 },
  { book: '2TI', chapter: 1, verse: 7 },
  { book: 'PSA', chapter: 16, verse: 11 },
  { book: 'ISA', chapter: 26, verse: 3 },
  { book: 'PSA', chapter: 55, verse: 22 },
  { book: 'MAT', chapter: 28, verse: 20 },
]

interface VerseOfTheDay {
  date: string
  scripture: {
    reference: string
    text: string
    translation?: string
  }
  encouragingThought?: any[]
}

/**
 * Get a deterministic verse for today based on the date
 * This ensures the same verse is shown on the same day each year
 */
function getVerseForToday(): { book: string; chapter: number; verse: number } {
  // Use day of year (1-365/366) to select a verse
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  // Use modulo to cycle through verses
  const verseIndex = dayOfYear % popularVerses.length
  return popularVerses[verseIndex]
}

/**
 * Fetch Verse of the Day from Bible API
 * 
 * TODO: Replace with YouVersion API when access is granted
 */
export async function fetchVerseOfTheDay(): Promise<VerseOfTheDay | null> {
  try {
    const bibleService = new BibleApiService()
    bibleService.setBibleId('de4e12af7f28f599-02') // KJV
    
    // Get verse for today
    const verseRef = getVerseForToday()
    const reference = `${verseRef.book}.${verseRef.chapter}.${verseRef.verse}`
    
    console.log('📖 Fetching Verse of the Day:', reference)
    
    // Fetch the verse
    const verseData = await bibleService.getVerse(reference)
    
    if (!verseData || !verseData.content) {
      console.error('❌ No content returned from Bible API')
      return null
    }
    
    // Clean the verse text
    let verseText = verseData.content
    // Remove HTML tags
    if (typeof window !== 'undefined') {
      const parser = new DOMParser()
      const doc = parser.parseFromString(verseText, 'text/html')
      verseText = doc.body?.textContent || verseText
    } else {
      // Server-side: use regex to strip HTML
      verseText = verseText.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    }
    
    // Remove verse number if it appears at the start
    verseText = verseText.replace(/^\d+\s*/, '').trim()
    
    // Format reference
    const bookName = getBookName(verseRef.book)
    const referenceText = `${bookName} ${verseRef.chapter}:${verseRef.verse}`
    
    return {
      date: new Date().toISOString().split('T')[0],
      scripture: {
        reference: referenceText,
        text: verseText,
        translation: 'KJV'
      }
      // encouragingThought is optional - can be added later via YouVersion API
    }
  } catch (error: any) {
    console.error('❌ Error fetching Verse of the Day from Bible API:', error)
    return null
  }
}

/**
 * Helper to get book name from book ID
 */
function getBookName(bookId: string): string {
  const bookMap: Record<string, string> = {
    'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus', 'NUM': 'Numbers', 'DEU': 'Deuteronomy',
    'JOS': 'Joshua', 'JDG': 'Judges', 'RUT': 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
    '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
    'EZR': 'Ezra', 'NEH': 'Nehemiah', 'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalms',
    'PRO': 'Proverbs', 'ECC': 'Ecclesiastes', 'SNG': 'Song of Solomon', 'ISA': 'Isaiah',
    'JER': 'Jeremiah', 'LAM': 'Lamentations', 'EZK': 'Ezekiel', 'DAN': 'Daniel',
    'HOS': 'Hosea', 'JOL': 'Joel', 'AMO': 'Amos', 'OBA': 'Obadiah', 'JON': 'Jonah',
    'MIC': 'Micah', 'NAM': 'Nahum', 'HAB': 'Habakkuk', 'ZEP': 'Zephaniah',
    'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi',
    'MAT': 'Matthew', 'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John', 'ACT': 'Acts',
    'ROM': 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', 'GAL': 'Galatians',
    'EPH': 'Ephesians', 'PHP': 'Philippians', 'COL': 'Colossians', '1TH': '1 Thessalonians',
    '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy', 'TIT': 'Titus',
    'PHM': 'Philemon', 'HEB': 'Hebrews', 'JAS': 'James', '1PE': '1 Peter', '2PE': '2 Peter',
    '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', 'JUD': 'Jude', 'REV': 'Revelation'
  }
  
  return bookMap[bookId] || bookId
}

/**
 * Future: Fetch from YouVersion API
 * 
 * TODO: Implement when YouVersion API access is granted
 * 
 * Example structure:
 * 
 * export async function fetchVerseOfTheDayFromYouVersion(): Promise<VerseOfTheDay | null> {
 *   try {
 *     const response = await fetch('https://api.youversion.com/v1/verse_of_the_day', {
 *       headers: {
 *         'Authorization': `Bearer ${process.env.YOUVERSION_API_KEY}`,
 *         'Accept': 'application/json'
 *       }
 *     })
 *     
 *     if (!response.ok) {
 *       throw new Error(`YouVersion API error: ${response.status}`)
 *     }
 *     
 *     const data = await response.json()
 *     
 *     return {
 *       date: data.date,
 *       scripture: {
 *         reference: data.reference,
 *         text: data.text,
 *         translation: data.translation
 *       },
 *       encouragingThought: data.thought || []
 *     }
 *   } catch (error) {
 *     console.error('Error fetching from YouVersion:', error)
 *     return null
 *   }
 * }
 */
