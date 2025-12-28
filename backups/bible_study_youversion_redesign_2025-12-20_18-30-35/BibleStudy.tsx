'use client'

import React, { useState, useEffect, useRef } from 'react'
import { BookOpen, Search, Bookmark, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import PlanReader from '../components/PlanReader'
import ReadingPlanCard from '../components/ReadingPlanCard'
import CategoryFilter from '../components/CategoryFilter'
import { readingPlans, getAllCategories, getFeaturedPlans, ReadingPlan, getPlanById } from '../data/readingPlans'
import { progressTracker } from '../lib/progress-tracker'
import { dbService } from '../lib/indexeddb'

type TabType = 'find-plans' | 'my-plans' | 'saved' | 'completed'

const BibleStudy = () => {
  const [activeTab, setActiveTab] = useState<TabType>('find-plans')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ReadingPlan['category'] | 'all'>('all')
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  const [showPlanReader, setShowPlanReader] = useState(false)
  const [planProgress, setPlanProgress] = useState<Record<string, number>>({})
  const [planCurrentDays, setPlanCurrentDays] = useState<Record<string, number>>({})
  const [savedPlans, setSavedPlans] = useState<Set<string>>(new Set())
  const [dbReady, setDbReady] = useState(true)
  const [showCategoryFilter, setShowCategoryFilter] = useState(true)
  
  const categories = getAllCategories()
  const featuredPlans = getFeaturedPlans()
  
  // Refs for horizontal scrolling
  const featuredScrollRef = useRef<HTMLDivElement>(null)
  const allPlansScrollRef = useRef<HTMLDivElement>(null)

  const scrollRow = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 400
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Initialize IndexedDB (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Set dbReady to true initially so page can render
    setDbReady(true)

    // Initialize IndexedDB asynchronously
    dbService.init()
      .then(() => {
        setDbReady(true)
        loadCurrentPlan()
        loadAllProgress()
        loadSavedPlans()
      })
      .catch((error) => {
        console.error('Error initializing IndexedDB:', error)
        // Don't block rendering - just mark as not ready
        setDbReady(false)
        // If it's a version error, try to recover
        if (error?.name === 'VersionError') {
          console.warn('IndexedDB version mismatch. Page will work but some features may be limited.')
        }
      })
  }, [])

  const loadCurrentPlan = async () => {
    if (typeof window === 'undefined') return
    
    try {
      const current = await dbService.getCurrentPlan()
      if (current && current.planId) {
        setCurrentPlanId(current.planId)
      }
    } catch (error) {
      console.error('Error loading current plan:', error)
    }
  }

  const loadAllProgress = async () => {
    if (typeof window === 'undefined') return
    
    try {
      const progressMap: Record<string, number> = {}
      const currentDaysMap: Record<string, number> = {}
      
      for (const plan of readingPlans) {
        try {
          const { progress } = await progressTracker.getCurrentPlan()
          if (progress && progress.planId === plan.id) {
            const percentage = await progressTracker.getProgressPercentage(plan.id)
            if (percentage > 0) {
              progressMap[plan.id] = percentage
              currentDaysMap[plan.id] = progress.currentDay
            }
          } else {
            // Check if plan has any progress
            const progress = await dbService.getProgress(plan.id)
            if (progress) {
              const percentage = await progressTracker.getProgressPercentage(plan.id)
              if (percentage > 0) {
                progressMap[plan.id] = percentage
                currentDaysMap[plan.id] = progress.currentDay
              }
            }
          }
        } catch (err) {
          // Skip this plan if there's an error
        }
      }
      setPlanProgress(progressMap)
      setPlanCurrentDays(currentDaysMap)
    } catch (error) {
      console.debug('Progress loading deferred:', error)
    }
  }

  const loadSavedPlans = async () => {
    if (typeof window === 'undefined') return
    
    try {
      const saved = await dbService.getSavedPlans()
      setSavedPlans(new Set(saved))
    } catch (error) {
      console.error('Error loading saved plans:', error)
    }
  }

  const handleStartPlan = async (planId: string) => {
    if (!dbReady) {
      alert('Database not ready. Please wait a moment and try again.')
      return
    }

    const plan = getPlanById(planId)
    if (!plan) {
      alert('Plan not found')
      return
    }

    try {
      await progressTracker.startPlan(plan)
      setCurrentPlanId(planId)
      setShowPlanReader(true)
      await loadAllProgress()
    } catch (error) {
      console.error('Error starting plan:', error)
      alert('Error starting plan. Please try again.')
    }
  }

  const handleContinuePlan = async (planId: string) => {
    setCurrentPlanId(planId)
    setShowPlanReader(true)
  }

  const handleSavePlan = async (planId: string) => {
    try {
      await dbService.savePlanToSaved(planId)
      setSavedPlans(new Set([...savedPlans, planId]))
    } catch (error) {
      console.error('Error saving plan:', error)
    }
  }

  const handleUnsavePlan = async (planId: string) => {
    try {
      await dbService.removeSavedPlan(planId)
      const newSaved = new Set(savedPlans)
      newSaved.delete(planId)
      setSavedPlans(newSaved)
    } catch (error) {
      console.error('Error unsaving plan:', error)
    }
  }

  const handleClosePlanReader = () => {
    setShowPlanReader(false)
    loadAllProgress()
  }

  // Filter plans based on active tab and search
  const getFilteredPlans = (): ReadingPlan[] => {
    let filtered = readingPlans

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter (only for find-plans tab)
    if (activeTab === 'find-plans' && selectedCategory !== 'all') {
      filtered = filtered.filter(plan => plan.category === selectedCategory)
    }

    // Apply tab filter
    switch (activeTab) {
      case 'my-plans':
        // Plans with progress
        return filtered.filter(plan => planProgress[plan.id] !== undefined && planProgress[plan.id] > 0)
      case 'saved':
        return filtered.filter(plan => savedPlans.has(plan.id))
      case 'completed':
        return filtered.filter(plan => planProgress[plan.id] === 100)
      case 'find-plans':
      default:
        return filtered
    }
  }

  const filteredPlans = getFilteredPlans()

  return (
    <div className="animate-fade-in min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Search */}
      <section className="py-16 bg-gradient-to-br from-sky-50/90 to-flame-50/90 dark:from-sky-900/30 dark:to-flame-900/30 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <BookOpen className="h-16 w-16 text-flame-500 mx-auto mb-6" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Bible Reading Plans & Daily Devotionals
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Dive deep into God's Word with structured reading plans designed for healing, growth, and understanding. 
              All plans work offline and are aligned with SDA beliefs.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reading plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-flame-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation - Centered */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 justify-center">
            {(['find-plans', 'my-plans', 'saved', 'completed'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-flame-600 dark:bg-flame-700 text-white border-b-2 border-flame-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {tab === 'my-plans' ? 'My Plans' : tab === 'find-plans' ? 'Find Plans' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Reader View */}
      {showPlanReader && currentPlanId && (
        <section className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
          <PlanReader planId={currentPlanId} onClose={handleClosePlanReader} />
        </section>
      )}

      {/* Main Content */}
      {!showPlanReader && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === 'find-plans' ? (
            <>
              {/* Featured Reading Plans Section */}
              {featuredPlans.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-3xl font-bold text-gray-800 dark:text-white">
                      Featured Reading Plans
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => scrollRow(featuredScrollRef, 'left')}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => scrollRow(featuredScrollRef, 'right')}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div
                    ref={featuredScrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {featuredPlans.map((plan) => (
                      <div key={plan.id} className="flex-shrink-0 w-80">
                        <ReadingPlanCard
                          plan={plan}
                          progress={planProgress[plan.id]}
                          isSaved={savedPlans.has(plan.id)}
                          onStart={() => handleStartPlan(plan.id)}
                          onContinue={() => handleContinuePlan(plan.id)}
                          onSave={() => handleSavePlan(plan.id)}
                          onUnsave={() => handleUnsavePlan(plan.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter by Category Section */}
              <div className="mb-12">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="flex items-center gap-2 mb-6 text-gray-800 dark:text-white font-semibold hover:text-flame-600 dark:hover:text-flame-400 transition-colors"
                >
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${showCategoryFilter ? 'rotate-180' : ''}`} />
                  <span>Filter by Category</span>
                </button>
                {showCategoryFilter && (
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                )}
              </div>

              {/* All Reading Plans Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="font-serif text-2xl font-bold text-gray-800 dark:text-white">
                      All Reading Plans
                    </h2>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
                    </span>
                  </div>
                  {filteredPlans.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => scrollRow(allPlansScrollRef, 'left')}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => scrollRow(allPlansScrollRef, 'right')}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
                {filteredPlans.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      No plans found. Try adjusting your search or filters.
                    </p>
                  </div>
                ) : (
                  <div
                    ref={allPlansScrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredPlans.map((plan) => (
                      <div key={plan.id} className="flex-shrink-0 w-80">
                        <ReadingPlanCard
                          plan={plan}
                          progress={planProgress[plan.id]}
                          isSaved={savedPlans.has(plan.id)}
                          onStart={() => handleStartPlan(plan.id)}
                          onContinue={() => handleContinuePlan(plan.id)}
                          onSave={() => handleSavePlan(plan.id)}
                          onUnsave={() => handleUnsavePlan(plan.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* My Plans, Saved, Completed - Grid View */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800 dark:text-white">
                  {activeTab === 'my-plans' ? 'My Plans' : activeTab === 'saved' ? 'Saved Plans' : 'Completed Plans'}
                </h2>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {activeTab === 'my-plans' && 'You haven\'t started any plans yet.'}
                      {activeTab === 'saved' && 'You haven\'t saved any plans yet.'}
                      {activeTab === 'completed' && 'You haven\'t completed any plans yet.'}
                    </p>
                  </div>
                ) : (
                  filteredPlans.map((plan) => (
                    <ReadingPlanCard
                      key={plan.id}
                      plan={plan}
                      progress={planProgress[plan.id]}
                      onStart={() => handleStartPlan(plan.id)}
                      onContinue={() => handleContinuePlan(plan.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bible Study Tips Section */}
      <section className="py-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Bible Study Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-sky-50/90 to-sky-100/90 dark:from-sky-900/30 dark:to-sky-800/30 backdrop-blur-sm rounded-xl p-6 border border-sky-200/50 dark:border-sky-700/50">
              <h3 className="font-serif text-xl font-semibold text-sky-700 dark:text-sky-300 mb-4">
                Start with Prayer
              </h3>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                Before diving into Scripture, ask the Holy Spirit to open your heart and mind 
                to receive God's truth. Prayer prepares us to hear from God through His Word.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-flame-50/90 to-flame-100/90 dark:from-flame-900/30 dark:to-flame-800/30 backdrop-blur-sm rounded-xl p-6 border border-flame-200/50 dark:border-flame-700/50">
              <h3 className="font-serif text-xl font-semibold text-flame-700 dark:text-flame-300 mb-4">
                Read in Context
              </h3>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                Understanding the historical and cultural context helps us interpret Scripture 
                accurately. Consider who wrote it, when, and to whom it was written.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-sage-50/90 to-sage-100/90 dark:from-sage-900/30 dark:to-sage-800/30 backdrop-blur-sm rounded-xl p-6 border border-sage-200/50 dark:border-sage-700/50">
              <h3 className="font-serif text-xl font-semibold text-sage-700 dark:text-sage-300 mb-4">
                Apply Personally
              </h3>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                Ask yourself: "What is God saying to me through this passage?" Look for 
                practical ways to apply biblical truths to your daily life and relationships.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50/90 to-purple-100/90 dark:from-purple-900/30 dark:to-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50">
              <h3 className="font-serif text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
                Study Consistently
              </h3>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                Regular, consistent study is more beneficial than occasional long sessions. 
                Even 10-15 minutes daily can transform your relationship with God.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BibleStudy
