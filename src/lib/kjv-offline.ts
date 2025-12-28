// KJV Offline Service - Downloads and caches KJV Bible text

import { dbService, KJVTextData } from './indexeddb'
import { bibleBooks, getBookById } from '../data/bibleData'

const KJV_BIBLE_ID = '06125adad2d5898a-01' // KJV Bible ID from scripture.api.bible
const API_BASE_URL = 'https://api.scripture.api.bible/v1'
const API_KEY = '69c0975e7dee3b884f01a69cc52901db' // TODO: Move to env variable

interface DownloadProgress {
  book: string
  chapter: number
  totalChapters: number
  downloaded: number
  percentage: number
}

type ProgressCallback = (progress: DownloadProgress) => void

class KJVOfflineService {
  private isDownloading = false
  private downloadProgress: DownloadProgress | null = null

  /**
   * Check if KJV is already downloaded
   */
  async isDownloaded(): Promise<boolean> {
    return dbService.isKJVDownloaded()
  }

  /**
   * Download full KJV Bible (all books and chapters)
   */
  async downloadFullKJV(onProgress?: ProgressCallback): Promise<void> {
    if (this.isDownloading) {
      throw new Error('KJV download already in progress')
    }

    this.isDownloading = true
    const totalChapters = bibleBooks.reduce((sum, book) => sum + book.chapters, 0)
    let downloaded = 0

    try {
      for (const book of bibleBooks) {
        for (let chapter = 1; chapter <= book.chapters; chapter++) {
          try {
            await this.downloadChapter(book.id, chapter)
            downloaded++

            if (onProgress) {
              this.downloadProgress = {
                book: book.name,
                chapter,
                totalChapters,
                downloaded,
                percentage: Math.round((downloaded / totalChapters) * 100),
              }
              onProgress(this.downloadProgress)
            }

            // Small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 100))
          } catch (error) {
            console.error(`Failed to download ${book.name} ${chapter}:`, error)
            // Continue with next chapter
          }
        }
      }
    } finally {
      this.isDownloading = false
    }
  }

  /**
   * Download a single chapter
   */
  async downloadChapter(bookId: string, chapter: number): Promise<void> {
    // Check if already cached
    const cached = await dbService.getKJVChapter(bookId, chapter)
    if (cached) {
      return // Already downloaded
    }

    try {
      // Format reference for API (e.g., "GEN.1" or "1JN.1")
      const book = getBookById(bookId)
      if (!book) {
        throw new Error(`Book not found: ${bookId}`)
      }

      // Use passage endpoint which returns full chapter
      // API expects format like "GEN.1" (using book ID, not abbreviation)
      const reference = `${book.id}.${chapter}`
      const url = `${API_BASE_URL}/bibles/${KJV_BIBLE_ID}/passages/${reference}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`
      
      const response = await fetch(url, {
        headers: {
          'api-key': API_KEY,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        // Try alternative formats if first fails
        const alternatives = [
          `${book.id} ${chapter}`, // "GEN 1" (space instead of dot)
          `${book.name} ${chapter}`, // "Genesis 1"
          `${book.name}.${chapter}`, // "Genesis.1"
        ]

        for (const altReference of alternatives) {
          try {
            const altUrl = `${API_BASE_URL}/bibles/${KJV_BIBLE_ID}/passages/${encodeURIComponent(altReference)}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`
            const altResponse = await fetch(altUrl, {
              headers: {
                'api-key': API_KEY,
                'Accept': 'application/json',
              },
            })

            if (altResponse.ok) {
              const altData = await altResponse.json()
              const content = altData.data?.content || ''
              const verses = this.parseVerses(content)

              const kjvData: KJVTextData = {
                reference: `${bookId}.${chapter}.1-${Object.keys(verses).length}`,
                book: bookId,
                chapter,
                verses,
                cachedDate: new Date().toISOString(),
              }

              await dbService.saveKJVText(kjvData)
              return
            }
          } catch (err) {
            // Try next alternative
            continue
          }
        }

        // All formats failed
        console.error(`Failed to download ${book.name} ${chapter}: API returned ${response.status}`)
        throw new Error(`API error: ${response.status} - Could not find chapter using any reference format`)
      }

      const data = await response.json()
      const content = data.data?.content || ''

      // Parse verses from content
      const verses = this.parseVerses(content)

      // Store in IndexedDB
      const kjvData: KJVTextData = {
        reference: `${bookId}.${chapter}.1-${Object.keys(verses).length}`,
        book: bookId,
        chapter,
        verses,
        cachedDate: new Date().toISOString(),
      }

      await dbService.saveKJVText(kjvData)
    } catch (error) {
      console.error(`Error downloading ${bookId} ${chapter}:`, error)
      throw error
    }
  }

  /**
   * Parse verse text from API content
   * Content format: "1 In the beginning... 2 And the earth..."
   */
  private parseVerses(content: string): Record<number, string> {
    const verses: Record<number, string> = {}
    
    // Remove HTML tags if present
    const cleanContent = content.replace(/<[^>]*>/g, '')
    
    // Match verse numbers (1, 2, 3, etc.) followed by text
    const verseRegex = /(\d+)\s+([^\d]+?)(?=\d+\s+|$)/g
    let match

    while ((match = verseRegex.exec(cleanContent)) !== null) {
      const verseNum = parseInt(match[1], 10)
      const verseText = match[2].trim()
      if (verseNum && verseText) {
        verses[verseNum] = verseText
      }
    }

    // Fallback: if no verses found, store entire content as verse 1
    if (Object.keys(verses).length === 0 && cleanContent.trim()) {
      verses[1] = cleanContent.trim()
    }

    return verses
  }

  /**
   * Get KJV text for a specific passage (offline-first)
   */
  async getText(bookId: string, chapter: number, startVerse?: number, endVerse?: number): Promise<string | null> {
    // Try IndexedDB first
    const cached = await dbService.getKJVChapter(bookId, chapter)
    
    if (cached) {
      if (startVerse && endVerse) {
        // Return specific verses
        const verses: string[] = []
        for (let v = startVerse; v <= endVerse; v++) {
          if (cached.verses[v]) {
            verses.push(`${v} ${cached.verses[v]}`)
          }
        }
        return verses.length > 0 ? verses.join(' ') : null
      } else {
        // Return entire chapter
        return Object.entries(cached.verses)
          .map(([num, text]) => `${num} ${text}`)
          .join(' ')
      }
    }

    // Not cached - try API if online
    if (navigator.onLine) {
      try {
        await this.downloadChapter(bookId, chapter)
        // Retry after download
        return this.getText(bookId, chapter, startVerse, endVerse)
      } catch (error) {
        console.error('Failed to fetch from API:', error)
        return null
      }
    }

    return null
  }

  /**
   * Get download progress
   */
  getDownloadProgress(): DownloadProgress | null {
    return this.downloadProgress
  }

  /**
   * Check if download is in progress
   */
  isDownloadInProgress(): boolean {
    return this.isDownloading
  }
}

export const kjvService = new KJVOfflineService()
