'use client'

import React from 'react'
import { ReadingPlan } from '../data/readingPlans'

interface CategoryFilterProps {
  categories: ReadingPlan['category'][]
  selectedCategory: ReadingPlan['category'] | 'all'
  onSelectCategory: (category: ReadingPlan['category'] | 'all') => void
}

const categoryLabels: Record<ReadingPlan['category'], string> = {
  healing: 'Healing',
  prophecy: 'Prophecy',
  sabbath: 'Sabbath',
  health: 'Health',
  'new-believer': 'New Believer',
  advent: 'Advent',
  character: 'Character Study',
  topical: 'Topical',
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-flame-500 to-orange-500 text-white shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-flame-500 dark:hover:border-flame-500'
        }`}
      >
        All Plans
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-flame-500 to-orange-500 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-flame-500 dark:hover:border-flame-500'
          }`}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  )
}
