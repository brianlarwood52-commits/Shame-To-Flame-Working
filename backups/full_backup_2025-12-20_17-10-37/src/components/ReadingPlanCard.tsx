'use client'

import React from 'react'
import { BookOpen, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { ReadingPlan } from '../data/readingPlans'

interface ReadingPlanCardProps {
  plan: ReadingPlan
  progress?: number // 0-100 percentage
  onStart?: () => void
  onContinue?: () => void
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

export default function ReadingPlanCard({ plan, progress, onStart, onContinue }: ReadingPlanCardProps) {
  const hasProgress = progress !== undefined && progress > 0
  const gradientClass = categoryColors[plan.category] || 'from-sky-500 to-flame-500'

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      
      <div className="p-6">
        {/* Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-white text-xs font-semibold`}>
              {plan.duration} Days
            </div>
            {plan.sdaAligned && (
              <div className="px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 text-xs font-medium">
                SDA
              </div>
            )}
          </div>
          <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-flame-500 transition-colors" />
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {plan.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {plan.description}
        </p>

        {/* Category Tag */}
        <div className="mb-4">
          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {categoryLabels[plan.category]}
          </span>
        </div>

        {/* Progress Bar (if started) */}
        {hasProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${gradientClass} h-2 rounded-full transition-all duration-300`}
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
              ? 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white'
              : 'bg-gradient-to-r from-flame-500 to-orange-500 hover:from-flame-600 hover:to-orange-600 text-white'
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
