'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ReadingPlan } from '../data/readingPlans'
import YouVersionPlanCard from './YouVersionPlanCard'

interface CategoryRowProps {
  title: string
  plans: ReadingPlan[]
  planProgress: Record<string, number>
  planCurrentDays: Record<string, number>
  savedPlans: Set<string>
  onStart: (planId: string) => void
  onContinue: (planId: string) => void
  onSave: (planId: string) => void
  onUnsave: (planId: string) => void
}

export default function CategoryRow({
  title,
  plans,
  planProgress,
  planCurrentDays,
  savedPlans,
  onStart,
  onContinue,
  onSave,
  onUnsave,
}: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (plans.length === 0) return null

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h3 className="font-serif text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {plans.map((plan) => (
          <div key={plan.id} className="flex-shrink-0 w-64">
            <YouVersionPlanCard
              plan={plan}
              progress={planProgress[plan.id]}
              currentDay={planCurrentDays[plan.id]}
              isSaved={savedPlans.has(plan.id)}
              onStart={() => onStart(plan.id)}
              onContinue={() => onContinue(plan.id)}
              onSave={() => onSave(plan.id)}
              onUnsave={() => onUnsave(plan.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
