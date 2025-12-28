interface BibleVerse {
  id: string;
  orgId: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  content: string;
  reference: string;
}

interface BiblePassage {
  id: string;
  orgId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
}

interface BibleBook {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

class BibleApiService {
  private apiKey = '69c0975e7dee3b884f01a69cc52901db';
  private baseUrl = 'https://api.scripture.api.bible/v1';
  private bibleId = 'de4e12af7f28f599-02'; // Default: King James Version (KJV)

  constructor(bibleId?: string) {
    // API key is hardcoded for this application
    if (bibleId) {
      this.bibleId = bibleId;
    }
  }

  setBibleId(bibleId: string) {
    this.bibleId = bibleId;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      console.log('Making Bible API request to:', fullUrl);
      console.log('Using Bible ID:', this.bibleId);
      
      const response = await fetch(fullUrl, {
        headers: {
          'api-key': this.apiKey,
          'Accept': 'application/json',
        },
      });

      console.log('Bible API response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Bible API request failed: ${response.status} ${response.statusText}`;
        
        // Try to get more specific error information
        try {
          const errorData = await response.json();
          console.error('Bible API error details:', errorData);
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          }
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (jsonError) {
          // If we can't parse the error response, just use the status
          console.error('Could not parse error response:', jsonError);
        }

        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          errorMessage = 'Invalid or missing Bible API key. Please check your API key from scripture.api.bible and try again.';
        } else if (response.status === 403) {
          errorMessage = 'Access forbidden. Your Bible API key may not have permission to access this resource.';
        } else if (response.status === 404) {
          errorMessage = 'Bible verse or passage not found. Please check the reference format.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (response.status >= 500) {
          errorMessage = 'Bible API server error. Please try again later.';
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to Bible API. Please check your internet connection.');
      }
      throw error;
    }
  }

  async getPassage(reference: string): Promise<BiblePassage> {
    try {
      const formattedRef = this.formatReferenceForApi(reference);
      const url = `/bibles/${this.bibleId}/passages/${formattedRef}?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=true`;
      console.log('Bible API Request:', {
        bibleId: this.bibleId,
        reference: reference,
        formattedRef: formattedRef,
        fullUrl: `${this.baseUrl}${url}`
      });
      // Request HTML content with verse numbers for proper formatting
      const data = await this.makeRequest(url);
      return data.data;
    } catch (error) {
      console.error('Error fetching Bible passage:', error);
      console.error('Request details:', {
        bibleId: this.bibleId,
        reference: reference,
        formattedRef: this.formatReferenceForApi(reference)
      });
      throw error;
    }
  }

  async getVerse(reference: string): Promise<BibleVerse> {
    try {
      const formattedRef = this.formatReferenceForApi(reference);
      // Request HTML content with verse numbers for proper formatting
      const data = await this.makeRequest(`/bibles/${this.bibleId}/verses/${formattedRef}?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=true`);
      return data.data;
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      throw error;
    }
  }

  async searchVerses(query: string, limit: number = 10): Promise<BibleVerse[]> {
    try {
      const data = await this.makeRequest(`/bibles/${this.bibleId}/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      return data.data.verses || [];
    } catch (error) {
      console.error('Error searching Bible verses:', error);
      throw error;
    }
  }

  async getBooks(): Promise<BibleBook[]> {
    try {
      const data = await this.makeRequest(`/bibles/${this.bibleId}/books`);
      return data.data;
    } catch (error) {
      console.error('Error fetching Bible books:', error);
      throw error;
    }
  }

  // Helper method to list all available Bibles and find ESV
  async listBibles(): Promise<any[]> {
    try {
      const data = await this.makeRequest('/bibles');
      return data.data || [];
    } catch (error) {
      console.error('Error listing Bibles:', error);
      throw error;
    }
  }

  // Format reference for scripture.api.bible API
  private formatReferenceForApi(reference: string): string {
    // Handle shorthand verse ranges (e.g., 'PSA.55.12-14' -> 'PSA.55.12-PSA.55.14')
    const shorthandRangeMatch = reference.match(/^([A-Z0-9]+)\.(\d+)\.(\d+)-(\d+)$/);
    if (shorthandRangeMatch) {
      const [, book, chapter, startVerse, endVerse] = shorthandRangeMatch;
      return `${book}.${chapter}.${startVerse}-${book}.${chapter}.${endVerse}`;
    }

    // If already contains dots, return as-is (let API handle shorthand ranges)
    if (reference.includes('.')) {
      return reference;
    }

    // Parse "Book Chapter:Verse" format
    const match = reference.match(/^(\d?\s?\w+)\s+(\d+):(\d+)$/);
    if (match) {
      const [, book, chapter, verse] = match;
      const bookCode = this.getBookCode(book.trim());
      return `${bookCode}.${chapter}.${verse}`;
    }

    // Parse "Book Chapter" format
    const chapterMatch = reference.match(/^(\d?\s?\w+)\s+(\d+)$/);
    if (chapterMatch) {
      const [, book, chapter] = chapterMatch;
      const bookCode = this.getBookCode(book.trim());
      return `${bookCode}.${chapter}`;
    }

    return reference; // Return as-is if we can't parse it
  }

  // Map common book names to scripture.api.bible codes
  private getBookCode(bookName: string): string {
    const bookCodes: { [key: string]: string } = {
      'Genesis': 'GEN',
      'Exodus': 'EXO',
      'Leviticus': 'LEV',
      'Numbers': 'NUM',
      'Deuteronomy': 'DEU',
      'Joshua': 'JOS',
      'Judges': 'JDG',
      'Ruth': 'RUT',
      '1 Samuel': '1SA',
      '2 Samuel': '2SA',
      '1 Kings': '1KI',
      '2 Kings': '2KI',
      '1 Chronicles': '1CH',
      '2 Chronicles': '2CH',
      'Ezra': 'EZR',
      'Nehemiah': 'NEH',
      'Esther': 'EST',
      'Job': 'JOB',
      'Psalms': 'PSA',
      'Psalm': 'PSA',
      'Proverbs': 'PRO',
      'Ecclesiastes': 'ECC',
      'Song of Solomon': 'SNG',
      'Isaiah': 'ISA',
      'Jeremiah': 'JER',
      'Lamentations': 'LAM',
      'Ezekiel': 'EZK',
      'Daniel': 'DAN',
      'Hosea': 'HOS',
      'Joel': 'JOL',
      'Amos': 'AMO',
      'Obadiah': 'OBA',
      'Jonah': 'JON',
      'Micah': 'MIC',
      'Nahum': 'NAM',
      'Habakkuk': 'HAB',
      'Zephaniah': 'ZEP',
      'Haggai': 'HAG',
      'Zechariah': 'ZEC',
      'Malachi': 'MAL',
      'Matthew': 'MAT',
      'Mark': 'MRK',
      'Luke': 'LUK',
      'John': 'JHN',
      'Acts': 'ACT',
      'Romans': 'ROM',
      '1 Corinthians': '1CO',
      '2 Corinthians': '2CO',
      'Galatians': 'GAL',
      'Ephesians': 'EPH',
      'Philippians': 'PHP',
      'Colossians': 'COL',
      '1 Thessalonians': '1TH',
      '2 Thessalonians': '2TH',
      '1 Timothy': '1TI',
      '2 Timothy': '2TI',
      'Titus': 'TIT',
      'Philemon': 'PHM',
      'Hebrews': 'HEB',
      'James': 'JAS',
      '1 Peter': '1PE',
      '2 Peter': '2PE',
      '1 John': '1JN',
      '2 John': '2JN',
      '3 John': '3JN',
      'Jude': 'JUD',
      'Revelation': 'REV'
    };

    return bookCodes[bookName] || bookName.toUpperCase();
  }

  // Helper method to format verse references for API calls
  formatReference(book: string, chapter: number, verse?: number): string {
    const bookCode = this.getBookCode(book);
    if (verse) {
      return `${bookCode}.${chapter}.${verse}`;
    }
    return `${bookCode}.${chapter}`;
  }

  // Convert common reference formats to API format
  parseReference(reference: string): string {
    return this.formatReferenceForApi(reference);
  }

  // Process HTML content to format verses properly with numbers and line breaks
  formatVerseContent(htmlContent: string): string {
    if (!htmlContent) return '';
    
    // First, ensure we're working with a string
    if (typeof htmlContent !== 'string') {
      htmlContent = String(htmlContent);
    }

    // Use DOM parser for more reliable extraction (if available)
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const verses: Array<{number: string, text: string}> = [];
        
        // Find all verse spans with data-number attribute
        const verseSpans = doc.querySelectorAll('span[data-number]');
        
        // Get the parent container (usually a paragraph or div)
        const container = verseSpans[0]?.parentElement || doc.body;
        const allText = container.textContent || '';
        
        // Process each verse span
        verseSpans.forEach((span, index) => {
          const verseNumber = span.getAttribute('data-number');
          if (!verseNumber) return;
          
          // Find the position of this verse span in the full text
          const spanText = span.textContent || '';
          const spanIndex = allText.indexOf(spanText);
          
          if (spanIndex < 0) {
            // Fallback: just get text from span and following siblings
            let verseText = '';
            let node: Node | null = span;
            while (node) {
              if (node.nodeType === 3) {
                verseText += node.textContent || '';
              } else if (node.nodeType === 1) {
                const el = node as Element;
                if (el !== span && el.tagName === 'SPAN' && el.hasAttribute('data-number')) {
                  break;
                }
                if (!el.hasAttribute('data-number')) {
                  verseText += el.textContent || '';
                }
              }
              node = node.nextSibling;
            }
            verseText = verseText
              .trim()
              .replace(new RegExp(`^${verseNumber}\\s+`), '') // Remove "1 " pattern
              .replace(new RegExp(`^${verseNumber}`), '') // Remove "1" pattern (no space)
              .trim();
            if (verseText) {
              verses.push({ number: verseNumber, text: verseText });
            }
            return;
          }
          
          // Find the next verse span's position
          const nextSpan = verseSpans[index + 1];
          let endIndex = allText.length;
          
          if (nextSpan) {
            const nextSpanText = nextSpan.textContent || '';
            const nextIndex = allText.indexOf(nextSpanText, spanIndex);
            if (nextIndex > spanIndex) {
              endIndex = nextIndex;
            }
          }
          
            // Extract text between this verse and the next
            let verseText = allText.substring(spanIndex + spanText.length, endIndex).trim();
            
            // Remove verse number if it appears at the start (multiple patterns)
            verseText = verseText
              .replace(new RegExp(`^${verseNumber}\\s+`), '') // Remove "1 " pattern
              .replace(new RegExp(`^${verseNumber}`), '') // Remove "1" pattern (no space)
              .trim();
            
            if (verseText && verseText.length > 0) {
              verses.push({ number: verseNumber, text: verseText });
            }
        });
        
        console.log(`Parsed ${verses.length} verses using DOM parser`);
        
        if (verses.length > 0) {
          return verses.map(verse => `${verse.number} ${verse.text}`).join('\n\n');
        }
      } catch (error) {
        console.warn('DOM parsing failed, falling back to regex:', error);
      }
    }

    // Fallback to regex parsing
    let cleanContent = htmlContent
      .replace(/<\/?p[^>]*>/g, '') // Remove paragraph tags
      .replace(/<\/?div[^>]*>/g, '') // Remove div tags
      .replace(/<br\s*\/?>/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Extract verses with their numbers using regex patterns
    const verses: Array<{number: string, text: string}> = [];
    
    // Pattern 1: Look for verse spans with data-number attribute (more flexible)
    // This pattern captures: span with data-number, its content, and everything until next verse span
    const verseSpanPattern = /<span[^>]*data-number="(\d+)"[^>]*>(.*?)<\/span>(.*?)(?=<span[^>]*data-number="\d+"|$)/gs;
    let match;
    
    while ((match = verseSpanPattern.exec(cleanContent)) !== null) {
      const verseNumber = match[1];
      const spanContent = match[2] || '';
      const followingContent = match[3] || '';
      let verseText = (spanContent + followingContent).trim();
      
      // Remove verse number if it appears at the start (multiple patterns)
      verseText = verseText
        .replace(new RegExp(`^${verseNumber}\\s+`), '') // Remove "1 " pattern
        .replace(new RegExp(`^${verseNumber}`), '') // Remove "1" pattern (no space)
        .trim();
      
      if (verseText && verseText.length > 0) {
        verses.push({ number: verseNumber, text: verseText });
      }
    }

    // If still no verses found, try to extract from plain text with numbers
    if (verses.length === 0) {
      // Remove all HTML tags and look for number patterns
      const plainText = cleanContent.replace(/<[^>]*>/g, '').trim();
      
      // Split by potential verse numbers (standalone numbers at start of segments)
      const segments = plainText.split(/(?=\b\d+\s+)/);
      
      segments.forEach(segment => {
        const trimmed = segment.trim();
        if (trimmed) {
          const numberMatch = trimmed.match(/^(\d+)\s+(.+)/);
          if (numberMatch) {
            verses.push({ 
              number: numberMatch[1], 
              text: numberMatch[2].trim() 
            });
          } else if (verses.length === 0) {
            // If no number found and this is the first segment, assume it's verse 1
            verses.push({ number: '1', text: trimmed });
          }
        }
      });
    }

    // Format the verses with proper spacing and line breaks
    if (verses.length > 0) {
      const formatted = verses.map(verse => {
        // Ensure text has no HTML tags and no verse numbers
        let cleanText = verse.text
          .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
          .replace(/&nbsp;/g, ' ') // Replace HTML entities
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ') // Normalize whitespace
          // Remove verse number if it appears at the start (multiple patterns)
          .replace(new RegExp(`^${verse.number}\\s+`), '') // Remove "1 " pattern
          .replace(new RegExp(`^${verse.number}`), '') // Remove "1" pattern (no space)
          .trim();
        return `${verse.number} ${cleanText}`;
      }).join('\n\n');
      
      console.log(`Formatted ${verses.length} verses. First verse: "${verses[0]?.number} ${verses[0]?.text?.substring(0, 50)}..."`);
      return formatted;
    }

    // Fallback: return cleaned content as-is (strip all HTML)
    const fallback = cleanContent
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    console.warn('No verses found, returning fallback content');
    return fallback;
  }
}

export default BibleApiService;
export type { BibleVerse, BiblePassage, BibleBook };