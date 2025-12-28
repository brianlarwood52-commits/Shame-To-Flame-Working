'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Mail, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import { fetchVerseOfTheDay } from '../services/verseOfTheDayService'

interface VerseOfTheDay {
  date: string
  scripture: {
    reference: string
    text: string
    translation?: string
  }
  encouragingThought?: any[] // Portable text (optional)
}

interface VerseOfTheDayProps {
  className?: string
}

const VerseOfTheDay: React.FC<VerseOfTheDayProps> = ({ className = '' }) => {
  const router = useRouter()
  const [verse, setVerse] = useState<VerseOfTheDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Fetch today's verse from Bible API
  useEffect(() => {
    const fetchTodaysVerse = async () => {
      try {
        console.log('📖 Fetching Verse of the Day from Bible API...')
        
        const data = await fetchVerseOfTheDay()
        
        if (data) {
          console.log('✅ Found verse for today:', data.scripture?.reference)
          setVerse(data)
        } else {
          console.log('⚠️ No verse found, will use default')
        }
      } catch (error: any) {
        console.error('❌ Error fetching verse of the day:', error)
        console.error('Error details:', error.message)
        // Don't set loading to false on error - let it show default verse
      } finally {
        setLoading(false)
      }
    }

    fetchTodaysVerse()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    setSubscriptionStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/verse-of-day/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscriptionStatus('success')
        setMessage('Successfully subscribed! Check your email to confirm.')
        setEmail('')
      } else {
        setSubscriptionStatus('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setSubscriptionStatus('error')
      setMessage('An error occurred. Please try again later.')
    } finally {
      setIsSubscribing(false)
    }
  }

  // Helper to render portable text
  const renderPortableText = (blocks: any[]) => {
    if (!blocks || !Array.isArray(blocks)) return null
    
    return blocks.map((block, index) => {
      if (block._type === 'block') {
        const text = block.children?.map((child: any) => child.text).join('') || ''
        return (
          <p key={index} className="mb-2">
            {text}
          </p>
        )
      }
      return null
    })
  }

  // Fallback verse if none found
  const defaultVerse: VerseOfTheDay = {
    date: new Date().toISOString().split('T')[0],
    scripture: {
      reference: 'Jeremiah 29:11',
      text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
      translation: 'NIV'
    },
    encouragingThought: []
  }

  const displayVerse = verse || defaultVerse

  // Truncate verse text to fit card format
  const maxVerseLength = 120
  const verseText = displayVerse.scripture.text.length > maxVerseLength
    ? displayVerse.scripture.text.substring(0, maxVerseLength) + '...'
    : displayVerse.scripture.text

  // Handle card click to navigate to Bible Reader
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on form elements or links
    const target = e.target as HTMLElement
    if (target.closest('form') || target.closest('input') || target.closest('button') || target.closest('a')) {
      e.stopPropagation()
      return
    }
    // Navigate to Bible Reader with verse reference
    const reference = encodeURIComponent(displayVerse.scripture.reference)
    router.push(`/bible-reader?ref=${reference}`)
  }

  if (loading) {
    return (
      <div className={`group block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/20 dark:border-gray-700/50 aspect-[3/4] ${className}`}>
        <div className="h-28 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`group block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/20 dark:border-gray-700/50 aspect-[3/4] ${className}`}>
      {/* Top Colored Section - Matching resource cards exactly */}
      <div className="h-28 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl lg:text-2xl font-serif font-bold mb-2">Verse of the Day</div>
        </div>
      </div>

      {/* Bottom Dark Content Section - Matching resource cards exactly */}
      <div className="p-6 flex flex-col">
        {/* Verse Reference */}
        <p className="text-sm font-semibold text-flame-600 dark:text-flame-400 mb-2 group-hover:text-flame-700 dark:group-hover:text-flame-300 transition-colors">
          {displayVerse.scripture.reference}
          {displayVerse.scripture.translation && (
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
              ({displayVerse.scripture.translation})
            </span>
          )}
        </p>

        {/* Verse Text */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5 text-sm line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          "{verseText}"
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubscribe} className="space-y-1.5 mb-3 mt-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full px-2 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isSubscribing}
            className="w-full px-2 h-6 bg-flame-600 hover:bg-flame-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            {isSubscribing ? (
              <>
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <Mail className="h-2.5 w-2.5" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </form>

        {/* Status Message */}
        {message && (
          <div className={`mb-2 flex items-center gap-1.5 text-xs ${
            subscriptionStatus === 'success' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {subscriptionStatus === 'success' ? (
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
            ) : (
              <XCircle className="h-3 w-3 flex-shrink-0" />
            )}
            <span className="line-clamp-1">{message}</span>
          </div>
        )}

        {/* Unsubscribe Link - Matching resource card style */}
        <div className="flex items-center text-flame-600 dark:text-flame-400 font-medium group-hover:text-flame-700 dark:group-hover:text-flame-300 text-xs">
          <Link href="/unsubscribe" className="flex items-center">
            Unsubscribe
            <ArrowRight className="ml-1.5 h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerseOfTheDay
