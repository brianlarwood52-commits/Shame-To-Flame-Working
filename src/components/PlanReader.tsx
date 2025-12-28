'use client'

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Download, X, Calendar } from 'lucide-react'
import { progressTracker } from '../lib/progress-tracker'
import { kjvService } from '../lib/kjv-offline'
import { ReadingPlan } from '../data/readingPlans'
import { getBookById } from '../data/bibleData'

interface PlanReaderProps {
  planId: string
  onClose?: () => void
}

export default function PlanReader({ planId, onClose }: PlanReaderProps) {
  const [plan, setPlan] = useState<ReadingPlan | null>(null)
  const [currentDay, setCurrentDay] = useState<number>(1)
  const [kjvText, setKjvText] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [textLoading, setTextLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [kjvDownloaded, setKjvDownloaded] = useState(false)

  useEffect(() => {
    loadPlan()
    checkKJVStatus()
  }, [planId])

  useEffect(() => {
    if (plan) {
      loadTodaysReading()
    }
  }, [plan, currentDay])

  // Scroll to top when day changes - MUST be before early returns
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentDay])

  const loadPlan = async () => {
    try {
      // Get plan from static data first
      const { getPlanById } = await import('../data/readingPlans')
      const staticPlan = getPlanById(planId)
      if (!staticPlan) {
        console.error('Plan not found:', planId)
        setLoading(false)
        return
      }

      setPlan(staticPlan)

      // Check if plan is started (has progress)
      const { progress } = await progressTracker.getCurrentPlan()
      if (progress && progress.planId === planId) {
        setCurrentDay(progress.currentDay)
        setIsCompleted(progress.completedDays.includes(progress.currentDay))
      } else {
        // Plan not started yet
        setCurrentDay(1)
        setIsCompleted(false)
      }
    } catch (error) {
      console.error('Error loading plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkKJVStatus = async () => {
    const downloaded = await kjvService.isDownloaded()
    setKjvDownloaded(downloaded)
  }

  const loadTodaysReading = async () => {
    if (!plan) return

    const reading = plan.readings.find(r => r.day === currentDay)
    if (!reading || reading.scripture.length === 0) return

    setTextLoading(true)
    try {
      // Load all scripture references for this day
      const scriptureTexts: string[] = []
      
      for (const ref of reading.scripture) {
        if (ref.verse) {
          // Single verse
          const text = await kjvService.getText(ref.book, ref.chapter, ref.verse, ref.verse)
          if (text) {
            scriptureTexts.push(`${ref.book} ${ref.chapter}:${ref.verse}\n${text}`)
          }
        } else if (ref.startVerse && ref.endVerse) {
          // Verse range
          const text = await kjvService.getText(ref.book, ref.chapter, ref.startVerse, ref.endVerse)
          if (text) {
            scriptureTexts.push(`${ref.book} ${ref.chapter}:${ref.startVerse}-${ref.endVerse}\n${text}`)
          }
        } else {
          // Full chapter
          const text = await kjvService.getText(ref.book, ref.chapter)
          if (text) {
            scriptureTexts.push(`${ref.book} ${ref.chapter}\n${text}`)
          }
        }
      }

      if (scriptureTexts.length > 0) {
        setKjvText(scriptureTexts.join('\n\n'))
      } else {
        setKjvText('Text not available offline. Please download KJV or connect to internet.')
      }
    } catch (error) {
      console.error('Error loading text:', error)
      setKjvText('Error loading text')
    } finally {
      setTextLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!plan) return

    try {
      await progressTracker.completeDay(plan.id, currentDay)
      setIsCompleted(true)
    } catch (error) {
      console.error('Error completing day:', error)
    }
  }

  const handleUncomplete = async () => {
    if (!plan) return

    try {
      await progressTracker.uncompleteDay(plan.id, currentDay)
      setIsCompleted(false)
    } catch (error) {
      console.error('Error uncompleting day:', error)
    }
  }

  const handleNextDay = async () => {
    if (!plan || currentDay >= plan.duration) return

    try {
      await progressTracker.nextDay(plan.id)
      setCurrentDay(currentDay + 1)
      setIsCompleted(false)
    } catch (error) {
      console.error('Error advancing day:', error)
    }
  }

  const handlePreviousDay = async () => {
    if (!plan || currentDay <= 1) return

    try {
      await progressTracker.previousDay(plan.id)
      setCurrentDay(currentDay - 1)
      // Check if this day is completed
      const { progress } = await progressTracker.getCurrentPlan()
      setIsCompleted(progress?.completedDays.includes(currentDay - 1) || false)
    } catch (error) {
      console.error('Error going back:', error)
    }
  }

  const handleDownloadKJV = async () => {
    if (!navigator.onLine) {
      alert('You need to be online to download KJV. Please check your internet connection.')
      return
    }

    if (!confirm('Downloading the full KJV Bible will take several minutes and use about 4-5MB of storage. Continue?')) {
      return
    }

    try {
      await kjvService.downloadFullKJV((progress) => {
        console.log(`Downloading: ${progress.percentage}% - ${progress.book} ${progress.chapter}`)
        // TODO: Show progress UI
      })
      alert('KJV download complete! You can now read offline.')
      setKjvDownloaded(true)
    } catch (error) {
      console.error('Error downloading KJV:', error)
      alert('Error downloading KJV. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading plan...</p>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Plan not found</p>
      </div>
    )
  }

  const reading = plan.readings.find(r => r.day === currentDay)

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation Header - Like YouVersion */}
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Plan Title & Day Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Back to plans"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-lg font-bold text-gray-800 dark:text-white truncate">
                    {plan.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    DAY {currentDay} OF {plan.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Day Navigation - Pagination Style */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handlePreviousDay}
                disabled={currentDay <= 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Day Selector - Show current day number */}
              <div className="px-3 py-1.5 bg-flame-100 dark:bg-flame-900/50 rounded-lg">
                <span className="text-sm font-semibold text-flame-700 dark:text-flame-300">
                  {currentDay}
                </span>
              </div>

              <button
                onClick={handleNextDay}
                disabled={currentDay >= plan.duration}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next day"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round((currentDay / plan.duration) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-flame-500 to-orange-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentDay / plan.duration) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KJV Download Status */}
        {!kjvDownloaded && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Download KJV for offline reading
                </p>
              </div>
              <button
                onClick={handleDownloadKJV}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Download KJV
              </button>
            </div>
          </div>
        )}

        {/* Complete Button - Prominent */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={isCompleted ? handleUncomplete : handleComplete}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
              isCompleted
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gradient-to-r from-flame-500 to-orange-500 hover:from-flame-600 hover:to-orange-600 text-white'
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            {isCompleted ? '✓ Completed' : 'Mark as Complete'}
          </button>
        </div>

        {/* Today's Reading */}
        {reading && (
          <div className="space-y-8">
            {/* Devotional Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              {reading.dayTitle && (
                <h3 className="font-serif text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  {reading.dayTitle}
                </h3>
              )}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
                  {reading.devotional}
                </div>
              </div>
            </div>

            {/* Scripture Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6 text-flame-500" />
                <h3 className="font-serif text-2xl font-bold text-gray-800 dark:text-white">
                  Scripture
                </h3>
              </div>

              {/* Scripture References - Clickable Links */}
              <div className="mb-6 space-y-3">
                {reading.scripture.map((ref, idx) => {
                  const bookName = getBookById(ref.book)?.name || ref.book
                  let reference = `${bookName} ${ref.chapter}`
                  if (ref.verse) {
                    reference += `:${ref.verse}`
                  } else if (ref.startVerse && ref.endVerse) {
                    reference += `:${ref.startVerse}-${ref.endVerse}`
                  } else if (ref.startVerse) {
                    reference += `:${ref.startVerse}`
                  }
                  return (
                    <div
                      key={idx}
                      className="text-flame-600 dark:text-flame-400 font-semibold text-lg hover:text-flame-700 dark:hover:text-flame-300 cursor-pointer transition-colors"
                    >
                      {reference}
                    </div>
                  )
                })}
              </div>

              {/* Bible Text */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {textLoading ? (
                  <p className="text-gray-600 dark:text-gray-400">Loading text...</p>
                ) : kjvText ? (
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
                    {kjvText}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Text not available. Please download KJV or check your connection.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handlePreviousDay}
                disabled={currentDay <= 1}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous Day
              </button>

              <button
                onClick={handleNextDay}
                disabled={currentDay >= plan.duration}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Next Day
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
