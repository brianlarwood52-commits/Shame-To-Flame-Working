'use client'

import React from 'react'
import { ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react'
import { ReadingPlan } from '../data/readingPlans'

interface YouVersionPlanCardProps {
  plan: ReadingPlan
  progress?: number // 0-100 percentage
  currentDay?: number
  isSaved?: boolean
  onStart?: () => void
  onContinue?: () => void
  onSave?: () => void
  onUnsave?: () => void
}

const categoryColors = {
  healing: 'from-flame-500 to-orange-500',
  prophecy: 'from-purple-500 to-indigo-500',
  sabbath: 'from-sky-500 to-blue-500',
  health: 'from-green-500 to-emerald-500',
  'new-believer': 'from-pink-500 to-rose-500',
  advent: 'from-yellow-500 to-amber-500',
  character: 'from-teal-500 to-cyan-500',
  topical: 'from-sage-500 to-slate-500',
}

export default function YouVersionPlanCard({ 
  plan, 
  progress, 
  currentDay,
  isSaved = false,
  onStart, 
  onContinue,
  onSave,
  onUnsave
}: YouVersionPlanCardProps) {
  const hasProgress = progress !== undefined && progress > 0 && currentDay !== undefined
  const isCompleted = progress === 100
  const gradientClass = categoryColors[plan.category] || 'from-sky-500 to-flame-500'

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image/Thumbnail Placeholder - YouVersion style */}
      <div className={`h-32 bg-gradient-to-br ${gradientClass} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-6xl font-serif font-bold">
            {plan.title.charAt(0)}
          </div>
        </div>
        {/* Save button overlay */}
        {(onSave || onUnsave) && (
          <button
            onClick={isSaved ? onUnsave : onSave}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
            aria-label={isSaved ? 'Unsave plan' : 'Save plan'}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-flame-500" />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {plan.title}
        </h3>

        {/* Progress Bar & Day Info - YouVersion style */}
        {hasProgress && !isCompleted && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
              <div
                className={`bg-gradient-to-r ${gradientClass} h-1 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Day {currentDay} of {plan.duration}
            </p>
          </div>
        )}

        {/* Duration (if not started) */}
        {!hasProgress && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {plan.duration} Days
          </p>
        )}

        {/* Completed indicator */}
        {isCompleted && (
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-3">
            Completed
          </p>
        )}

        {/* Action Button - YouVersion style */}
        <button
          onClick={hasProgress ? onContinue : onStart}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition-all duration-200 group"
        >
          <span>{hasProgress ? 'Continue' : 'Start'}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
