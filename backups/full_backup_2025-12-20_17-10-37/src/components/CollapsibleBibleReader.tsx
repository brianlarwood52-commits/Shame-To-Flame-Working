'use client'

import React, { useState, useEffect, useRef } from 'react'
import { BookOpen, Search, X, Settings, Play, Pause, Square, Volume2, VolumeX, ChevronLeft, ChevronRight, Type, User } from 'lucide-react'
import BibleApiService from '../services/bibleApi'
import { bibleVersions, bibleBooks, getBookById, getVersionById } from '../data/bibleData'

interface CollapsibleBibleReaderProps {
  className?: string
}

const CollapsibleBibleReader: React.FC<CollapsibleBibleReaderProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [referenceInput, setReferenceInput] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Bible selection - Start with NO selections (user must choose)
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [selectedChapter, setSelectedChapter] = useState<number>(0)
  const [startVerse, setStartVerse] = useState<number | null>(null)
  const [endVerse, setEndVerse] = useState<number | null>(null)
  
  // Settings
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState('text-lg')
  
  // Voice reading
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [speechRate, setSpeechRate] = useState(1)
  const [speechVolume, setSpeechVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [parsedVerses, setParsedVerses] = useState<Array<{number: string, text: string, words: string[]}>>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVerseForReading, setSelectedVerseForReading] = useState<number | null>(null)

  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wordIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  const boundaryEventWorkingRef = useRef(false)
  const lastBoundaryTimeRef = useRef(0)
  const lastWordIndexRef = useRef(0)

  const currentBook = selectedBook ? getBookById(selectedBook) : null
  const currentVersion = selectedVersion ? getVersionById(selectedVersion) : null
  const bibleServiceRef = useRef<BibleApiService>(new BibleApiService())
  
  // Update bible service with selected version when it changes
  useEffect(() => {
    if (selectedVersion) {
      bibleServiceRef.current.setBibleId(selectedVersion)
    }
  }, [selectedVersion])

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'))
      setAvailableVoices(englishVoices)
      
      const femaleVoice = englishVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('allison') ||
        voice.name.toLowerCase().includes('zira')
      )
      
      setSelectedVoice(femaleVoice || englishVoices[0] || null)
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    // Stop speech when content changes
    stopReading()
  }, [content])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopReading()
    }
  }, [])

  // Parse reference from text input
  const parseReference = (ref: string): { book: string; chapter: number; verse?: number; endVerse?: number } | null => {
    const cleanRef = ref.trim().toLowerCase()
    
    const patterns = [
      /^(\d?\s?\w+)\s+(\d+):(\d+)-(\d+)$/,
      /^(\d?\s?\w+)\s+(\d+):(\d+)$/,
      /^(\d?\s?\w+)\s+(\d+)$/,
    ]

    for (const pattern of patterns) {
      const match = cleanRef.match(pattern)
      if (match) {
        const bookName = match[1].replace(/\s+/g, '')
        const chapter = parseInt(match[2], 10)
        const verse = match[3] ? parseInt(match[3], 10) : undefined
        const endVerse = match[4] ? parseInt(match[4], 10) : undefined

        const bookMap: Record<string, string> = {
          'genesis': 'GEN', 'gen': 'GEN', 'exodus': 'EXO', 'exo': 'EXO',
          'leviticus': 'LEV', 'lev': 'LEV', 'numbers': 'NUM', 'num': 'NUM',
          'deuteronomy': 'DEU', 'deu': 'DEU', 'joshua': 'JOS', 'jos': 'JOS',
          'judges': 'JDG', 'jdg': 'JDG', 'ruth': 'RUT', 'rut': 'RUT',
          '1samuel': '1SA', '1sam': '1SA', '2samuel': '2SA', '2sam': '2SA',
          '1kings': '1KI', '1ki': '1KI', '2kings': '2KI', '2ki': '2KI',
          '1chronicles': '1CH', '1ch': '1CH', '2chronicles': '2CH', '2ch': '2CH',
          'ezra': 'EZR', 'ezr': 'EZR', 'nehemiah': 'NEH', 'neh': 'NEH',
          'esther': 'EST', 'est': 'EST', 'job': 'JOB',
          'psalms': 'PSA', 'psa': 'PSA', 'psalm': 'PSA',
          'proverbs': 'PRO', 'pro': 'PRO', 'prov': 'PRO',
          'ecclesiastes': 'ECC', 'ecc': 'ECC', 'songofsongs': 'SNG', 'sng': 'SNG',
          'isaiah': 'ISA', 'isa': 'ISA', 'jeremiah': 'JER', 'jer': 'JER',
          'lamentations': 'LAM', 'lam': 'LAM', 'ezekiel': 'EZK', 'ezk': 'EZK',
          'daniel': 'DAN', 'dan': 'DAN', 'hosea': 'HOS', 'hos': 'HOS',
          'joel': 'JOL', 'jol': 'JOL', 'amos': 'AMO', 'amo': 'AMO',
          'obadiah': 'OBA', 'oba': 'OBA', 'jonah': 'JON', 'jon': 'JON',
          'micah': 'MIC', 'mic': 'MIC', 'nahum': 'NAM', 'nam': 'NAM',
          'habakkuk': 'HAB', 'hab': 'HAB', 'zephaniah': 'ZEP', 'zep': 'ZEP',
          'haggai': 'HAG', 'hag': 'HAG', 'zechariah': 'ZEC', 'zec': 'ZEC',
          'malachi': 'MAL', 'mal': 'MAL',
          'matthew': 'MAT', 'mat': 'MAT', 'matt': 'MAT',
          'mark': 'MRK', 'mrk': 'MRK', 'mar': 'MRK',
          'luke': 'LUK', 'luk': 'LUK',
          'john': 'JHN', 'jhn': 'JHN', 'joh': 'JHN',
          'acts': 'ACT', 'act': 'ACT',
          'romans': 'ROM', 'rom': 'ROM',
          '1corinthians': '1CO', '1co': '1CO', '1cor': '1CO',
          '2corinthians': '2CO', '2co': '2CO', '2cor': '2CO',
          'galatians': 'GAL', 'gal': 'GAL',
          'ephesians': 'EPH', 'eph': 'EPH',
          'philippians': 'PHL', 'phl': 'PHL', 'phil': 'PHL',
          'colossians': 'COL', 'col': 'COL',
          '1thessalonians': '1TH', '1th': '1TH', '1thess': '1TH',
          '2thessalonians': '2TH', '2th': '2TH', '2thess': '2TH',
          '1timothy': '1TI', '1ti': '1TI', '1tim': '1TI',
          '2timothy': '2TI', '2ti': '2TI', '2tim': '2TI',
          'titus': 'TIT', 'tit': 'TIT',
          'philemon': 'PHM', 'phm': 'PHM',
          'hebrews': 'HEB', 'heb': 'HEB',
          'james': 'JAS', 'jas': 'JAS', 'jam': 'JAS',
          '1peter': '1PE', '1pe': '1PE', '1pet': '1PE',
          '2peter': '2PE', '2pe': '2PE', '2pet': '2PE',
          '1john': '1JN', '1jn': '1JN', '1joh': '1JN',
          '2john': '2JN', '2jn': '2JN', '2joh': '2JN',
          '3john': '3JN', '3jn': '3JN', '3joh': '3JN',
          'jude': 'JUD', 'jud': 'JUD',
          'revelation': 'REV', 'rev': 'REV',
        }

        const bookId = bookMap[bookName]
        if (bookId) {
          return { book: bookId, chapter, verse, endVerse }
        }
      }
    }

    return null
  }

  const loadContent = async () => {
    // Only load if user has selected version, book, AND chapter (chapter must be > 0)
    if (!selectedVersion || !selectedBook || !selectedChapter || selectedChapter === 0) {
      setContent('')
      setIsExpanded(false)
      return
    }
    
    try {
      setLoading(true)
      setError('')
      setIsExpanded(true) // Auto-expand when loading

      // Ensure bibleService uses the selected version
      bibleServiceRef.current.setBibleId(selectedVersion)
      
      // Verify the version was set correctly
      console.log('Bible service version set to:', selectedVersion, 'Current service bibleId:', bibleServiceRef.current['bibleId'])
      
      let reference = `${selectedBook}.${selectedChapter}`
      
      if (startVerse) {
        if (endVerse && endVerse !== startVerse) {
          // Format: BOOK.CHAPTER.START-BOOK.CHAPTER.END
          reference = `${selectedBook}.${selectedChapter}.${startVerse}-${selectedBook}.${selectedChapter}.${endVerse}`
        } else {
          // Single verse: BOOK.CHAPTER.VERSE
          reference = `${selectedBook}.${selectedChapter}.${startVerse}`
        }
      }

      console.log('Loading Bible passage:', {
        reference: reference,
        version: selectedVersion,
        versionName: currentVersion?.name || 'Unknown',
        book: selectedBook,
        chapter: selectedChapter,
        startVerse: startVerse,
        endVerse: endVerse
      })
      
      const data = await bibleServiceRef.current.getPassage(reference)

      let textContent = ''
      if (data && data.content) {
        if (typeof data.content === 'string') {
          textContent = data.content
        } else {
          textContent = JSON.stringify(data.content)
        }
      }

      // Use BibleApiService's formatVerseContent - it has robust parsing logic
      // This method handles various HTML formats and extracts verses properly
      let formattedContent = bibleServiceRef.current.formatVerseContent(textContent)
      
      // Ensure all HTML is stripped - double check
      if (formattedContent && formattedContent.includes('<')) {
        console.warn('Formatted content still contains HTML tags, stripping...')
        // Remove any remaining HTML tags
        formattedContent = formattedContent
          .replace(/<[^>]*>/g, '') // Remove all HTML tags
          .replace(/&nbsp;/g, ' ') // Replace HTML entities
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
      }
      
      // Debug: Log the formatted content to see what we're getting
      console.log('Formatted content length:', formattedContent.length)
      console.log('Formatted content preview:', formattedContent.substring(0, 500))
      console.log('Has double newlines?', formattedContent.includes('\n\n'))
      console.log('Contains HTML tags?', formattedContent.includes('<'))
      
      // Check if we got actual content
      if (formattedContent && formattedContent.trim().length > 0) {
        setContent(formattedContent)
      } else {
        // If formatVerseContent returned empty, try direct HTML parsing as fallback
        console.warn('formatVerseContent returned empty, trying direct HTML parsing')
        if (typeof window !== 'undefined') {
          const parser = new DOMParser()
          const doc = parser.parseFromString(textContent, 'text/html')
          
          // Get all text content from the body
          const bodyText = doc.body?.textContent || doc.documentElement?.textContent || ''
          
          if (bodyText.trim()) {
            // Try to split by verse numbers
            const verses = bodyText.split(/(?=\b\d+\s+[A-Z])/).filter(v => v.trim())
            if (verses.length > 0) {
              setContent(verses.join('\n\n'))
            } else {
              // Last resort: use the raw text
              setContent(bodyText.trim())
            }
          } else {
            setError('No content found in response')
            setContent('')
          }
        } else {
          setError('Failed to parse content')
          setContent('')
        }
      }
    } catch (err) {
      console.error('Error loading Bible content:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Bible content'
      
      // Provide more helpful error message for ESV
      if (selectedVersion === '06125adad2d5898a-01' && errorMessage.includes('404')) {
        setError('ESV Bible ID may be incorrect. Please try a different version or contact support.')
      } else {
        setError(errorMessage)
      }
      
      setContent('')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!referenceInput.trim()) {
      setError('Please enter a Bible reference')
      return
    }

    const parsed = parseReference(referenceInput)
    if (!parsed) {
      setError('Invalid reference format. Try: "John 3:16" or "Psalm 23"')
      return
    }

    setError('')
    setSelectedBook(parsed.book)
    setSelectedChapter(parsed.chapter)
    setStartVerse(parsed.verse || null)
    setEndVerse(parsed.endVerse || null)
    
    // Update bible service with selected version
    if (parsed.book) {
      bibleServiceRef.current.setBibleId(selectedVersion)
    }
    
    // Load content will be triggered by useEffect
    await loadContent()
  }

  // Track if user has explicitly requested to load content (via verse input or Enter key)
  const [shouldLoadContent, setShouldLoadContent] = useState(false)

  // Load content ONLY after user has selected version, book, AND chapter AND entered verse OR pressed Enter
  useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      setContent('')
      setIsExpanded(false)
      setShouldLoadContent(false)
      return
    }
    
    // Only load if ALL required fields are selected AND user has triggered load (verse entered or Enter pressed)
    if (selectedVersion && selectedBook && selectedChapter > 0 && shouldLoadContent) {
      loadContent()
      setShouldLoadContent(false) // Reset after loading
    } else if (!selectedVersion || !selectedBook || selectedChapter === 0) {
      // Clear content if selections aren't complete
      setContent('')
      setIsExpanded(false)
      setShouldLoadContent(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVersion, selectedBook, selectedChapter, startVerse, endVerse, shouldLoadContent])


  const parseContentForReading = (content: string): Array<{number: string, text: string, words: string[]}> => {
    if (!content) return []

    const verses = content.split('\n\n').filter(verse => verse.trim())
    
    return verses.map(verse => {
      const trimmedVerse = verse.trim()
      const verseMatch = trimmedVerse.match(/^(\d+)\s*(.+)$/s)
      
      if (verseMatch) {
        const [, verseNumber, verseText] = verseMatch
        // Remove verse number from text if it appears at the start
        let cleanText = verseText
          .replace(/^\d+\s+/, '') // Remove "1 " pattern
          .replace(/^\d+/, '') // Remove "1" pattern (no space)
          .trim()
        const words = cleanText.split(/\s+/).filter(word => word.length > 0 && !/^\d+$/.test(word)) // Filter out standalone numbers
        return { number: verseNumber, text: cleanText, words }
      } else {
        // Remove any leading numbers
        let cleanText = trimmedVerse
          .replace(/^\d+\s+/, '') // Remove "1 " pattern
          .replace(/^\d+/, '') // Remove "1" pattern (no space)
          .trim()
        const words = cleanText.split(/\s+/).filter(word => word.length > 0 && !/^\d+$/.test(word))
        return { number: '1', text: cleanText, words }
      }
    })
  }

  const startReading = (fromVerseIndex?: number, readOnlyThisVerse: boolean = false) => {
    if (!content) return

    const verses = parseContentForReading(content)
    if (verses.length === 0) return

    const startIndex = fromVerseIndex !== undefined ? fromVerseIndex : currentVerseIndex
    setIsPlaying(true)
    setIsPaused(false)
    setSelectedVerseForReading(readOnlyThisVerse ? startIndex : null)
    readVerse(startIndex, 0, readOnlyThisVerse)
  }

  const readVerse = (verseIndex: number, wordIndex: number = 0, readOnlyThisVerse: boolean = false) => {
    if (verseIndex >= parsedVerses.length) {
      stopReading()
      return
    }

    const verse = parsedVerses[verseIndex]
    if (!verse || wordIndex >= verse.words.length) {
      if (readOnlyThisVerse) {
        stopReading()
        return
      }
      
      setCurrentVerseIndex(verseIndex + 1)
      setCurrentWordIndex(0)
      lastWordIndexRef.current = 0
      readVerse(verseIndex + 1, 0, false)
      return
    }

    setCurrentVerseIndex(verseIndex)
    setCurrentWordIndex(wordIndex)
    lastWordIndexRef.current = wordIndex

    const remainingWords = verse.words.slice(wordIndex)
    const textToSpeak = remainingWords.join(' ')

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = speechRate
      utterance.volume = isMuted ? 0 : speechVolume
      utterance.voice = selectedVoice

      // Reset boundary tracking
      boundaryEventWorkingRef.current = false
      lastBoundaryTimeRef.current = Date.now()

      // Start time-based highlighting immediately (works for all voices)
      const startTime = Date.now()
      
      // Track word boundaries - PRIMARY METHOD (when available, overrides time-based)
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          boundaryEventWorkingRef.current = true
          lastBoundaryTimeRef.current = Date.now()
          
          // Calculate which word we're on based on character position in textToSpeak
          const charIndex = event.charIndex || 0
          
          // Build up the text character by character to match words exactly
          const textBefore = textToSpeak.substring(0, charIndex)
          
          // Split by spaces and filter empty strings to match verse.words array
          const wordsBefore = textBefore.trim().split(/\s+/).filter(w => w.length > 0 && !/^\d+$/.test(w))
          
          // Map to actual verse word index (wordIndex is the starting point)
          const newWordIndex = wordIndex + wordsBefore.length
          
          // Ensure we're within bounds and only move forward (prevent jumping backwards)
          if (newWordIndex < verse.words.length && 
              newWordIndex >= wordIndex && 
              newWordIndex >= lastWordIndexRef.current) {
            setCurrentWordIndex(newWordIndex)
            lastWordIndexRef.current = newWordIndex
          }
        }
      }
      
      // FALLBACK: Start immediately and run continuously
      // onboundary will override when it fires, but this ensures highlighting works for all voices
      wordIntervalRef.current = setInterval(() => {
        // Check if speech is still active
        if (!speechSynthesis.speaking && !speechSynthesis.paused) {
          if (wordIntervalRef.current) {
            clearInterval(wordIntervalRef.current)
            wordIntervalRef.current = null
          }
          return
        }
        
        // If onboundary fired recently (within 200ms), trust it and skip this update
        const timeSinceLastBoundary = Date.now() - lastBoundaryTimeRef.current
        if (boundaryEventWorkingRef.current && timeSinceLastBoundary < 200) {
          return // onboundary is working, skip time-based update
        }
        
        // Use time-based estimation (works for all voices, even when onboundary doesn't fire)
        const elapsed = (Date.now() - startTime) / 1000 // seconds
        
        // More accurate words-per-second calculation
        // Average speaking rate: ~150 words/min = 2.5 words/sec at rate 1.0
        const baseWordsPerSecond = 2.5
        const wordsPerSecond = baseWordsPerSecond * speechRate
        const estimatedWords = Math.floor(elapsed * wordsPerSecond)
        const newWordIndex = wordIndex + Math.min(estimatedWords, remainingWords.length)
        
        // Only update if within bounds and moving forward
        if (newWordIndex < verse.words.length && 
            newWordIndex >= wordIndex && 
            newWordIndex >= lastWordIndexRef.current) {
          setCurrentWordIndex(newWordIndex)
          lastWordIndexRef.current = newWordIndex
        }
      }, 100) // Update every 100ms for smooth highlighting
      
      // Clean up intervals and handle verse completion
      utterance.onend = () => {
        // Clear word highlighting interval
        if (wordIntervalRef.current) {
          clearInterval(wordIntervalRef.current)
          wordIntervalRef.current = null
        }
        
        if (readOnlyThisVerse) {
          stopReading()
          return
        }
        
        setCurrentVerseIndex(verseIndex + 1)
        setCurrentWordIndex(0)
        
        if (verseIndex + 1 < parsedVerses.length) {
          timeoutRef.current = setTimeout(() => {
            readVerse(verseIndex + 1, 0, false)
          }, 300)
        } else {
          stopReading()
        }
      }

      utterance.onerror = () => {
        stopReading()
      }

      speechSynthesisRef.current = utterance
      speechSynthesis.speak(utterance)
    }
  }

  const pauseReading = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause()
      setIsPaused(true)
      // Pause word highlighting interval
      if (wordIntervalRef.current) {
        clearInterval(wordIntervalRef.current)
        wordIntervalRef.current = null
      }
    }
  }

  const resumeReading = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPaused(false)
      // Resume word highlighting (will be restarted in readVerse)
      // The interval will restart when the next word boundary event fires
    }
  }

  const stopReading = () => {
    // Clear word highlighting interval
    if (wordIntervalRef.current) {
      clearInterval(wordIntervalRef.current)
      wordIntervalRef.current = null
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel()
    }
    
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentVerseIndex(0)
    setCurrentWordIndex(0)
    lastWordIndexRef.current = 0
    setSelectedVerseForReading(null)
    speechSynthesisRef.current = null
    boundaryEventWorkingRef.current = false
    lastBoundaryTimeRef.current = 0
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.volume = isMuted ? speechVolume : 0
    }
  }

  const handleVerseClick = (verseIndex: number, event: React.MouseEvent) => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return
    }

    if (isPlaying) {
      stopReading()
    }

    if (event.shiftKey) {
      startReading(verseIndex, true)
    } else if (event.ctrlKey || event.metaKey) {
      startReading(verseIndex, false)
    } else {
      setCurrentVerseIndex(verseIndex)
      setCurrentWordIndex(0)
    }
  }

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1)
      setStartVerse(null)
      setEndVerse(null)
    } else {
      const currentIndex = bibleBooks.findIndex(book => book.id === selectedBook)
      if (currentIndex > 0) {
        const previousBook = bibleBooks[currentIndex - 1]
        setSelectedBook(previousBook.id)
        setSelectedChapter(previousBook.chapters)
        setStartVerse(null)
        setEndVerse(null)
      }
    }
  }

  const handleNextChapter = () => {
    if (currentBook && selectedChapter < currentBook.chapters) {
      setSelectedChapter(prev => prev + 1)
      setStartVerse(null)
      setEndVerse(null)
    } else {
      const currentIndex = bibleBooks.findIndex(book => book.id === selectedBook)
      if (currentIndex < bibleBooks.length - 1) {
        const nextBook = bibleBooks[currentIndex + 1]
        setSelectedBook(nextBook.id)
        setSelectedChapter(1)
        setStartVerse(null)
        setEndVerse(null)
      }
    }
  }

  const formatReference = () => {
    if (!currentBook || !selectedChapter) return ''
    
    let ref = `${currentBook.name} ${selectedChapter}`
    if (startVerse) {
      ref += `:${startVerse}`
      if (endVerse && endVerse !== startVerse) {
        ref += `-${endVerse}`
      }
    }
    return ref
  }

  const canGoPrevious = () => {
    if (selectedChapter > 1) return true
    const currentIndex = bibleBooks.findIndex(book => book.id === selectedBook)
    return currentIndex > 0
  }

  const canGoNext = () => {
    if (currentBook && selectedChapter < currentBook.chapters) return true
    const currentIndex = bibleBooks.findIndex(book => book.id === selectedBook)
    return currentIndex < bibleBooks.length - 1
  }

  const renderFormattedContent = (content: string) => {
    if (!content || parsedVerses.length === 0) return null

    // Use parsedVerses directly to ensure word indices match exactly
    return (
      <div className="space-y-4">
        {parsedVerses.map((verse, verseIndex) => {
          if (!verse || !verse.text) return null

          return (
            <div 
              key={verseIndex} 
              className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-5 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-flame-400 dark:hover:border-flame-600 bg-white dark:bg-gray-800/50 shadow-sm"
              onClick={(e) => handleVerseClick(verseIndex, e)}
              title="Click to select • Shift+click to read this verse only • Ctrl+click to read from here"
            >
              <div className="flex gap-4 items-start">
                {/* Verse Number - Large, prominent badge */}
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center justify-center w-12 h-12 text-base font-bold rounded-full transition-all duration-200 ${
                    isPlaying && currentVerseIndex === verseIndex 
                      ? 'text-white bg-flame-600 shadow-lg scale-110 ring-2 ring-flame-300' 
                      : 'text-flame-600 dark:text-flame-400 bg-flame-100 dark:bg-flame-900/30 hover:bg-flame-200 dark:hover:bg-flame-800/50'
                  }`}>
                    {verse.number}
                  </span>
                </div>
                
                {/* Verse Text - Use the same words array as parsing for exact match */}
                <div className="flex-1 min-w-0">
                  <p className="leading-relaxed text-gray-800 dark:text-gray-100 text-base font-serif">
                    {verse.words.map((word, wordIndex) => {
                      const isCurrentWord = isPlaying && 
                        currentVerseIndex === verseIndex && 
                        currentWordIndex === wordIndex
                      
                      return (
                        <span
                          key={wordIndex}
                          className={`transition-all duration-200 ${
                            isCurrentWord 
                              ? 'bg-flame-200 dark:bg-flame-800 text-flame-900 dark:text-flame-100 px-1.5 py-0.5 rounded shadow-sm font-medium' 
                              : ''
                          }`}
                        >
                          {word}
                          {wordIndex < verse.words.length - 1 ? ' ' : ''}
                        </span>
                      )
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const getFontSizeClasses = () => {
    const sizeMap: { [key: string]: string } = {
      'text-sm': 'text-sm leading-6',
      'text-base': 'text-base leading-7',
      'text-lg': 'text-lg leading-8',
      'text-xl': 'text-xl leading-9',
      'text-2xl': 'text-2xl leading-10'
    }
    return sizeMap[fontSize] || 'text-lg leading-8'
  }

  useEffect(() => {
    if (content) {
      const verses = parseContentForReading(content)
      setParsedVerses(verses)
    }
  }, [content])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearContent = () => {
    setContent('')
    setReferenceInput('')
    setError('')
    setIsExpanded(false)
    stopReading()
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg ${className}`}>
      {/* Search Bar - Always Visible */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-flame-500 flex-shrink-0" />
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Bible reference (e.g., John 3:16, Psalm 23, Romans 8:1-4)"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-flame-500 focus:border-transparent"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !referenceInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-flame-500 to-orange-500 hover:from-flame-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Bible Selection Controls - Always Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Version
            </label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {bibleVersions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.abbreviation} - {version.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Book
            </label>
            <select
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value)
                setSelectedChapter(0) // Reset to 0 (no selection) when book changes
                setStartVerse(null)
                setEndVerse(null)
              }}
              disabled={!selectedVersion}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <option value="">Select Book</option>
              <optgroup label="Old Testament">
                {bibleBooks.filter(book => book.testament === 'Old').map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="New Testament">
                {bibleBooks.filter(book => book.testament === 'New').map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chapter
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(Number(e.target.value))
                setStartVerse(null)
                setEndVerse(null)
              }}
              disabled={!selectedBook}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <option value="0">Select Chapter</option>
              {currentBook ? Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((chapter) => (
                <option key={chapter} value={chapter}>
                  {chapter}
                </option>
              )) : null}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verse (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={startVerse ? (endVerse && endVerse !== startVerse ? `${startVerse}-${endVerse}` : `${startVerse}`) : ''}
                onChange={(e) => {
                  const input = e.target.value.trim()
                  
                  if (!input) {
                    setStartVerse(null)
                    setEndVerse(null)
                    return
                  }
                  
                  // Parse range format: "1-10" or single verse "1"
                  const rangeMatch = input.match(/^(\d+)(?:-(\d+))?$/)
                  if (rangeMatch) {
                    const start = Number(rangeMatch[1])
                    const end = rangeMatch[2] ? Number(rangeMatch[2]) : start
                    
                    if (start > 0 && end >= start) {
                      setStartVerse(start)
                      setEndVerse(end)
                      
                      // Trigger load when verse is entered
                      if (selectedVersion && selectedBook && selectedChapter > 0) {
                        setShouldLoadContent(true)
                      }
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // Trigger load on Enter key, even if no verse entered (loads entire chapter)
                  if (e.key === 'Enter' && selectedVersion && selectedBook && selectedChapter > 0) {
                    e.preventDefault()
                    setShouldLoadContent(true)
                  }
                }}
                disabled={!selectedChapter || selectedChapter === 0}
                placeholder="e.g., 1 or 1-10"
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-flame-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              />
              {(startVerse || endVerse) && (
                <button
                  onClick={() => {
                    setStartVerse(null)
                    setEndVerse(null)
                  }}
                  className="px-2 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="Clear verse selection"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter verse number (e.g., 1) or range (e.g., 1-10), or press Enter to load entire chapter
            </p>
          </div>
        </div>

        {/* Settings Button */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
          </button>
          {isExpanded && (
            <button
              onClick={clearContent}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Font Size:</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Medium</option>
                  <option value="text-lg">Large</option>
                  <option value="text-xl">Extra Large</option>
                  <option value="text-2xl">XXL</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Speed:</span>
                <select
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 w-8">{Math.round(speechVolume * 100)}%</span>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-shrink-0">Voice:</span>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const voice = availableVoices.find(v => v.name === e.target.value)
                      setSelectedVoice(voice || null)
                    }}
                    className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} {voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') ? '♀' : '♂'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area - Only shows when expanded AND content is loaded */}
      {isExpanded && (content || loading) && (
        <div className="p-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePreviousChapter}
              disabled={!canGoPrevious()}
              className="inline-flex items-center px-4 py-2 bg-flame-600 hover:bg-flame-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="text-center">
              <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-white">
                {formatReference()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentVersion?.name}
              </p>
            </div>

            <button
              onClick={handleNextChapter}
              disabled={!canGoNext()}
              className="inline-flex items-center px-4 py-2 bg-flame-600 hover:bg-flame-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          {/* Audio Controls */}
          {content && !loading && !error && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {!isPlaying ? (
                      <button
                        onClick={() => startReading()}
                        className="flex items-center gap-2 bg-flame-600 hover:bg-flame-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <Play className="h-4 w-4" />
                        Read Aloud
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {!isPaused ? (
                          <button
                            onClick={pauseReading}
                            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            <Pause className="h-4 w-4" />
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={resumeReading}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            <Play className="h-4 w-4" />
                            Resume
                          </button>
                        )}
                        <button
                          onClick={stopReading}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          <Square className="h-4 w-4" />
                          Stop
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                </div>
                
                <div className="text-right">
                  {isPlaying && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Reading verse {currentVerseIndex + 1} of {parsedVerses.length}
                      {selectedVerseForReading !== null && (
                        <div className="text-xs text-flame-600 dark:text-flame-400">
                          Single verse mode
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click verse • Shift+click: read verse only • Ctrl+click: read from verse
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading Bible text...</p>
            </div>
          ) : error ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">{error}</p>
            </div>
          ) : content ? (
            <div className={`${getFontSizeClasses()}`}>
              <div className="font-serif text-gray-800 dark:text-gray-100 max-w-4xl mx-auto">
                {renderFormattedContent(content)}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Enter a Bible reference above to view the text
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CollapsibleBibleReader
