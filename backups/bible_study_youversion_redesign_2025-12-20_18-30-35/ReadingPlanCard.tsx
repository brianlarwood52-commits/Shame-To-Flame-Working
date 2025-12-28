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
  onUnsave
}: ReadingPlanCardProps) {
  const hasProgress = progress !== undefined && progress > 0

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        {/* Top Row: Duration, SDA, Bookmark */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-flame-600 text-white text-xs font-semibold">
              {plan.duration} Days
            </div>
            {plan.sdaAligned && (
              <div className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium">
                SDA
              </div>
            )}
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
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
          {plan.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {plan.description}
        </p>

        {/* Category Tag */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {categoryLabels[plan.category]}
          </span>
        </div>

        {/* Progress Bar (if started) */}
        {hasProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
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
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            hasProgress
              ? 'bg-sky-600 hover:bg-sky-700 text-white'
              : 'bg-flame-600 hover:bg-flame-700 text-white'
          } shadow-md hover:shadow-lg transform hover:scale-[1.02]`}
        >
          {hasProgress ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Continue Reading
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4" />
              Start Plan
            </>
          )}
        </button>
      </div>
    </div>
  )
}
