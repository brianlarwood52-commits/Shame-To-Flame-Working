'use client'

import React from 'react'
import { Bookmark, ArrowRight, CheckCircle } from 'lucide-react'
import { ReadingPlan } from '../data/readingPlans'

interface ReadingPlanCardProps {
  plan: ReadingPlan
  progress?: number // 0-100 percentage
  isSaved?: boolean
  onStart?: () => void
  onContinue?: () => void
  onSave?: () => void
  onUnsave?: () => void
  size?: 'featured' | 'default' | 'small'
  square?: boolean // Make card more square (for smaller rows)
}

const categoryLabels = {
  healing: 'Healing',
  prophecy: 'Prophecy',
  sabbath: 'Sabbath',
  health: 'Health',
  'new-believer': 'New Believer',
  advent: 'Advent',
  character: 'Character Study',
  topical: 'Topical',
}

export default function ReadingPlanCard({ 
  plan, 
  progress, 
  isSaved = false,
  onStart, 
  onContinue,
  onSave,
  onUnsave,
  size = 'default',
  square = false
}: ReadingPlanCardProps) {
  const hasProgress = progress !== undefined && progress > 0

  // Size-based styling - Mobile responsive
  const sizeClasses = {
    featured: {
      container: 'p-4 sm:p-6 md:p-8',
      title: 'text-lg sm:text-xl md:text-2xl',
      description: 'text-sm sm:text-base',
      badge: 'px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm',
      button: 'px-4 py-2.5 text-sm sm:px-6 sm:py-4 sm:text-base'
    },
    default: {
      container: 'p-4 sm:p-5 md:p-6',
      title: 'text-base sm:text-lg md:text-xl',
      description: 'text-xs sm:text-sm',
      badge: 'px-2.5 py-0.5 text-xs sm:px-3 sm:py-1',
      button: 'px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm'
    },
    small: {
      container: 'p-3 sm:p-3',
      title: 'text-sm sm:text-base',
      description: 'text-xs',
      badge: 'px-2 py-0.5 text-xs',
      button: 'px-2.5 py-1.5 text-xs'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 ${size === 'featured' ? 'shadow-2xl' : ''} ${square ? 'aspect-square flex flex-col' : ''}`}>
      <div className={`${classes.container} ${square ? 'flex-1 flex flex-col' : ''}`}>
        {/* Top Row: Duration, Bookmark */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`${classes.badge} rounded-full bg-flame-600 text-white font-semibold`}>
              {plan.duration} Days
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (isSaved && onUnsave) {
                onUnsave()
              } else if (!isSaved && onSave) {
                onSave()
              }
            }}
            className={`p-1.5 rounded transition-colors ${
              isSaved 
                ? 'text-flame-600 dark:text-flame-400' 
                : 'text-gray-400 hover:text-flame-600 dark:hover:text-flame-400'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save plan'}
          >
            <Bookmark className={`${size === 'featured' ? 'h-6 w-6' : 'h-5 w-5'} ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className={`font-serif ${classes.title} font-bold text-gray-800 dark:text-white mb-3 line-clamp-2`}>
          {plan.title}
        </h3>

        {/* Description */}
        <p className={`text-gray-600 dark:text-gray-300 ${classes.description} leading-relaxed mb-4 ${size === 'featured' ? 'line-clamp-4 sm:line-clamp-4' : square ? 'line-clamp-3 sm:line-clamp-2' : 'line-clamp-4 sm:line-clamp-3'} ${square ? 'flex-1' : ''}`}>
          {plan.description}
        </p>

        {/* Category Tag */}
        <div className="mb-4">
          <span className={`inline-block ${classes.badge} rounded font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}>
            {categoryLabels[plan.category]}
          </span>
        </div>

        {/* Progress Bar (if started) */}
        {hasProgress && (
          <div className="mb-4">
            <div className={`flex items-center justify-between ${classes.description} text-gray-600 dark:text-gray-400 mb-1`}>
              <span>Progress</span>
              <span>{Math.round(progress || 0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-flame-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={hasProgress ? onContinue : onStart}
          className={`w-full flex items-center justify-center gap-2 ${classes.button} rounded-lg font-semibold transition-all duration-200 ${
            hasProgress
              ? 'bg-sky-600 hover:bg-sky-700 text-white'
              : 'bg-flame-600 hover:bg-flame-700 text-white'
          } shadow-md hover:shadow-lg transform hover:scale-[1.02]`}
        >
          {hasProgress ? (
            <>
              <CheckCircle className={size === 'featured' ? 'h-5 w-5' : 'h-4 w-4'} />
              Continue Reading
            </>
          ) : (
            <>
              <ArrowRight className={size === 'featured' ? 'h-5 w-5' : 'h-4 w-4'} />
              Start Plan
            </>
          )}
        </button>
      </div>
    </div>
  )
}
