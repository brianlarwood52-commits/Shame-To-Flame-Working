'use client'

import React, { useEffect, useState } from 'react'
import { BookOpen, Calendar, ArrowRight, CheckCircle } from 'lucide-react'
import { progressTracker } from '../lib/progress-tracker'
import { ReadingPlan } from '../data/readingPlans'
import { getPlanById } from '../data/readingPlans'
import Link from 'next/link'

interface CurrentPlanWidgetProps {
  onViewReading?: () => void
}

export default function CurrentPlanWidget({ onViewReading }: CurrentPlanWidgetProps) {
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | null>(null)
  const [currentDay, setCurrentDay] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCurrentPlan()
  }, [])

  const loadCurrentPlan = async () => {
    try {
      const { progress: progressData } = await progressTracker.getCurrentPlan()
      
      if (progressData) {
        // Get full plan from static data using planId
        const fullPlan = getPlanById(progressData.planId)
        if (fullPlan) {
          setCurrentPlan(fullPlan)
          setCurrentDay(progressData.currentDay)
          
          const percentage = await progressTracker.getProgressPercentage(fullPlan.id)
          setProgress(percentage)
        }
      }
    } catch (error) {
      console.error('Error loading current plan:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (!currentPlan) {
    return null // No active plan
  }

  const todayReading = currentPlan.readings.find(r => r.day === currentDay)

  return (
    <div className="bg-gradient-to-br from-flame-50/90 to-orange-50/90 dark:from-flame-900/30 dark:to-orange-900/30 backdrop-blur-sm rounded-2xl p-6 border border-flame-200/50 dark:border-flame-700/50 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-flame-500 to-orange-500 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-800 dark:text-white">
              Current Reading Plan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentPlan.title}
            </p>
          </div>
        </div>
      </div>

      {todayReading && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="h-4 w-4" />
            <span className="font-semibold">Day {currentDay} of {currentPlan.duration}</span>
          </div>
          {todayReading.dayTitle && (
            <p className="text-gray-800 dark:text-white font-medium mb-2">
              {todayReading.dayTitle}
            </p>
          )}
          {todayReading.scripture.length > 0 && (
            <div className="space-y-1">
              {todayReading.scripture.map((ref, idx) => {
                const { getBookById } = require('../data/bibleData')
                const book = getBookById(ref.book)
                const bookName = book?.name || ref.book
                let reference = `${bookName} ${ref.chapter}`
                if (ref.verse) {
                  reference += `:${ref.verse}`
                } else if (ref.startVerse && ref.endVerse) {
                  reference += `:${ref.startVerse}-${ref.endVerse}`
                } else if (ref.startVerse) {
                  reference += `:${ref.startVerse}`
                }
                return (
                  <p key={idx} className="text-gray-800 dark:text-white font-medium text-sm">
                    {reference}
                  </p>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-flame-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onViewReading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-flame-500 to-orange-500 hover:from-flame-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
      >
        <ArrowRight className="h-4 w-4" />
        Continue Reading
      </button>
    </div>
  )
}
