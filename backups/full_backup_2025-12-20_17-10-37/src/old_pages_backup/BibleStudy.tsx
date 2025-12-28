'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, Search } from 'lucide-react'
import BibleReader from '../components/BibleReader'
import PlanReader from '../components/PlanReader'
import CategoryRow from '../components/CategoryRow'
import YouVersionPlanCard from '../components/YouVersionPlanCard'
import { readingPlans, getAllCategories, getFeaturedPlans, ReadingPlan, getPlanById } from '../data/readingPlans'
import { progressTracker } from '../lib/progress-tracker'
import { dbService } from '../lib/indexeddb'

type TabType = 'my-plans' | 'find-plans' | 'saved' | 'completed'

const BibleStudy = () => {
  const [activeTab, setActiveTab] = useState<TabType>('my-plans')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  const [showPlanReader, setShowPlanReader] = useState(false)
  const [planProgress, setPlanProgress] = useState<Record<string, number>>({})
  const [planCurrentDays, setPlanCurrentDays] = useState<Record<string, number>>({})
  const [savedPlans, setSavedPlans] = useState<Set<string>>(new Set())
  const [dbReady, setDbReady] = useState(true)
  
  const categories = getAllCategories()
  const featuredPlans = getFeaturedPlans()

  // Initialize IndexedDB (client-side only)
  useEffect(() => {
    setDbReady(true)
    
    if (typeof window === 'undefined') {
      return
    }

    dbService.init()
      .then(() => {
        setDbReady(true)
        loadCurrentPlan()
        loadAllProgress()
        loadSavedPlans()
      })
      .catch((error) => {
        console.error('Error initializing IndexedDB:', error)
        setDbReady(false)
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

  // Filter plans based on active tab
  const getFilteredPlans = (): ReadingPlan[] => {
    let filtered = readingPlans

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
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

  // Group plans by category
  const getPlansByCategory = (category: ReadingPlan['category']): ReadingPlan[] => {
    return getFilteredPlans().filter(plan => plan.category === category)
  }

  const filteredPlans = getFilteredPlans()

  return (
    <div className="animate-fade-in min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Search */}
      <section className="py-12 bg-gradient-to-br from-sky-50/90 to-flame-50/90 dark:from-sky-900/30 dark:to-flame-900/30 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <BookOpen className="h-12 w-12 text-flame-500 mx-auto mb-4" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Bible Reading Plans & Daily Devotionals
            </h1>
            
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

      {/* Tab Navigation - YouVersion Style - Centered */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 justify-center">
            {(['my-plans', 'find-plans', 'saved', 'completed'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-gray-800 dark:bg-gray-700 text-white border-b-2 border-flame-500'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'find-plans' ? (
            <>
              {/* Featured Plans Section */}
              {featuredPlans.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-serif text-2xl font-bold text-gray-800 dark:text-white mb-6 px-4 sm:px-6 lg:px-8">
                    Featured
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
                    {featuredPlans.map((plan) => (
                      <YouVersionPlanCard
                        key={plan.id}
                        plan={plan}
                        progress={planProgress[plan.id]}
                        currentDay={planCurrentDays[plan.id]}
                        isSaved={savedPlans.has(plan.id)}
                        onStart={() => handleStartPlan(plan.id)}
                        onContinue={() => handleContinuePlan(plan.id)}
                        onSave={() => handleSavePlan(plan.id)}
                        onUnsave={() => handleUnsavePlan(plan.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Category Rows - Horizontal Scrolling */}
              {categories.map((category) => {
                const categoryPlans = getPlansByCategory(category)
                if (categoryPlans.length === 0) return null

                const categoryLabels: Record<ReadingPlan['category'], string> = {
                  healing: 'Healing',
                  prophecy: 'Prophecy',
                  sabbath: 'Sabbath',
                  health: 'Health',
                  'new-believer': 'New to Faith',
                  advent: 'Advent',
                  character: 'Character Study',
                  topical: 'Topical',
                }

                return (
                  <CategoryRow
                    key={category}
                    title={categoryLabels[category]}
                    plans={categoryPlans}
                    planProgress={planProgress}
                    planCurrentDays={planCurrentDays}
                    savedPlans={savedPlans}
                    onStart={handleStartPlan}
                    onContinue={handleContinuePlan}
                    onSave={handleSavePlan}
                    onUnsave={handleUnsavePlan}
                  />
                )
              })}
            </>
          ) : (
            /* My Plans, Saved, Completed - Grid View */
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
                  <YouVersionPlanCard
                    key={plan.id}
                    plan={plan}
                    progress={planProgress[plan.id]}
                    currentDay={planCurrentDays[plan.id]}
                    isSaved={savedPlans.has(plan.id)}
                    onStart={() => handleStartPlan(plan.id)}
                    onContinue={() => handleContinuePlan(plan.id)}
                    onSave={() => handleSavePlan(plan.id)}
                    onUnsave={() => handleUnsavePlan(plan.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default BibleStudy
