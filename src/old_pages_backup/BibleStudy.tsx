'use client'

import React, { useState, useEffect, useRef } from 'react'
import { BookOpen, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import PlanReader from '../components/PlanReader'
import ReadingPlanCard from '../components/ReadingPlanCard'
import { readingPlans, getAllCategories, getFeaturedPlans, ReadingPlan, getPlanById } from '../data/readingPlans'
import { progressTracker } from '../lib/progress-tracker'
import { dbService } from '../lib/indexeddb'

type TabType = 'find-plans' | 'my-plans' | 'saved' | 'completed'

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

// Category colors for filter buttons (YouVersion style - less bright)
const categoryButtonColors: Record<ReadingPlan['category'], string> = {
  healing: 'bg-gradient-to-r from-pink-400 to-rose-400',
  prophecy: 'bg-gradient-to-r from-purple-400 to-indigo-400',
  sabbath: 'bg-gradient-to-r from-sky-400 to-blue-400',
  health: 'bg-gradient-to-r from-green-400 to-emerald-400',
  'new-believer': 'bg-gradient-to-r from-yellow-400 to-amber-400',
  advent: 'bg-gradient-to-r from-orange-400 to-red-400',
  character: 'bg-gradient-to-r from-teal-400 to-cyan-400',
  topical: 'bg-gradient-to-r from-slate-400 to-gray-500',
}

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
  
  const categories = getAllCategories()
  const featuredPlans = getFeaturedPlans()
  
  // Refs for horizontal scrolling - one per category row
  const scrollRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})
  
  const getCategoryScrollRef = (category: string): React.RefObject<HTMLDivElement> => {
    if (!scrollRefs.current[category]) {
      scrollRefs.current[category] = React.createRef<HTMLDivElement>()
    }
    return scrollRefs.current[category]
  }
  
  const featuredScrollRef = useRef<HTMLDivElement>(null)
  const myPlansScrollRef = useRef<HTMLDivElement>(null)
  const savedScrollRef = useRef<HTMLDivElement>(null)
  const completedScrollRef = useRef<HTMLDivElement>(null)

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

    setDbReady(true)

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

  // Get plans by category (for themed rows)
  const getPlansByCategory = (category: ReadingPlan['category']): ReadingPlan[] => {
    if (selectedCategory !== 'all' && selectedCategory !== category) {
      return []
    }
    const filtered = readingPlans.filter(plan => {
      const matchesSearch = !searchTerm || 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      return plan.category === category && matchesSearch
    })
    return filtered
  }

  const filteredPlans = getFilteredPlans()

  // Render a horizontal scrolling row (YouVersion style)
  const renderCategoryRow = (category: ReadingPlan['category'], title: string) => {
    const categoryPlans = getPlansByCategory(category)
    if (categoryPlans.length === 0) return null

    const scrollRef = getCategoryScrollRef(category)
    
    // Healing row stays exactly as it was - no changes
    const isHealing = category === 'healing'
    // Healing: w-64 on desktop, smaller on mobile
    // Others: w-48 on desktop, smaller on mobile
    const cardWidth = isHealing ? 'w-full sm:w-64' : 'w-full sm:w-48'
    const cardSize = isHealing ? 'default' : 'small'

    // Center titles and cards for Healing and Prophecy
    const shouldCenter = category === 'healing' || category === 'prophecy'
    
    return (
      <div className="mb-12" key={category}>
        <div className={`flex items-center ${shouldCenter ? 'justify-center' : 'justify-between'} mb-4`}>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
          {!shouldCenter && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollRow(scrollRef, 'left')}
                className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => scrollRow(scrollRef, 'right')}
                className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
        <div
          ref={scrollRef}
          className={`grid grid-cols-1 md:flex md:gap-3 md:overflow-x-auto md:scrollbar-hide gap-4 md:gap-3 pb-4 ${shouldCenter ? 'md:justify-center' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryPlans.map((plan) => (
            <div key={plan.id} className={`w-full max-w-sm mx-auto md:max-w-none md:flex-shrink-0 ${isHealing ? 'md:w-64' : 'md:w-48'}`}>
              <ReadingPlanCard
                plan={plan}
                progress={planProgress[plan.id]}
                isSaved={savedPlans.has(plan.id)}
                onStart={() => handleStartPlan(plan.id)}
                onContinue={() => handleContinuePlan(plan.id)}
                onSave={() => handleSavePlan(plan.id)}
                onUnsave={() => handleUnsavePlan(plan.id)}
                size={cardSize}
                square={!isHealing}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render a combined row for multiple categories
  const renderCombinedCategoryRow = (categoryList: ReadingPlan['category'][], title: string) => {
    const allPlans: Array<{ plan: ReadingPlan; category: ReadingPlan['category'] }> = []
    
    categoryList.forEach(category => {
      const categoryPlans = getPlansByCategory(category)
      categoryPlans.forEach(plan => {
        allPlans.push({ plan, category })
      })
    })

    if (allPlans.length === 0) return null

    const scrollRef = getCategoryScrollRef(`combined-${categoryList.join('-')}`)

    return (
      <div className="mb-12" key={`combined-${categoryList.join('-')}`}>
        <div className="flex items-center justify-center mb-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
        <div
          ref={scrollRef}
          className="grid grid-cols-1 md:flex md:gap-3 md:overflow-x-auto md:scrollbar-hide gap-4 md:gap-3 pb-4 md:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allPlans.map(({ plan, category }) => (
            <div key={plan.id} className="w-full max-w-sm mx-auto md:max-w-none md:flex-shrink-0 md:w-48">
              <ReadingPlanCard
                plan={plan}
                progress={planProgress[plan.id]}
                isSaved={savedPlans.has(plan.id)}
                onStart={() => handleStartPlan(plan.id)}
                onContinue={() => handleContinuePlan(plan.id)}
                onSave={() => handleSavePlan(plan.id)}
                onUnsave={() => handleUnsavePlan(plan.id)}
                size="small"
                square={true}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

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
              All plans work offline.
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

      {/* Tab Navigation - Centered, Mobile Responsive */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 justify-center overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {(['find-plans', 'my-plans', 'saved', 'completed'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
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
              {/* Featured Reading Plans Section - YouVersion Style (LARGE Cards) */}
              {featuredPlans.length > 0 && (
                <div className="mb-16">
                  <div className="flex flex-col md:flex-row items-center md:justify-between mb-6">
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0 text-center md:text-left">
                      Featured Reading Plans
                    </h2>
                    <div className="hidden md:flex items-center gap-2">
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
                    className="grid grid-cols-1 md:flex md:gap-6 md:overflow-x-auto md:scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {featuredPlans.map((plan) => (
                      <div key={plan.id} className="w-full max-w-sm mx-auto md:max-w-none md:flex-shrink-0 md:w-[500px]">
                        <ReadingPlanCard
                          plan={plan}
                          progress={planProgress[plan.id]}
                          isSaved={savedPlans.has(plan.id)}
                          onStart={() => handleStartPlan(plan.id)}
                          onContinue={() => handleContinuePlan(plan.id)}
                          onSave={() => handleSavePlan(plan.id)}
                          onUnsave={() => handleUnsavePlan(plan.id)}
                          size="featured"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter Buttons - YouVersion Style (Full Width Rectangles, Mobile Scrollable) */}
              <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <div className="flex gap-0 w-full overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`flex-shrink-0 min-w-[100px] sm:min-w-[120px] sm:flex-1 py-3 sm:py-4 rounded-none text-xs sm:text-base font-bold transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-flame-400/90 to-orange-400/90 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    style={selectedCategory === 'all' ? {
                      textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                    } : {}}
                  >
                    All Plans
                  </button>
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex-shrink-0 min-w-[100px] sm:min-w-[120px] sm:flex-1 py-3 sm:py-4 rounded-none text-xs sm:text-base font-bold transition-all duration-200 text-white whitespace-nowrap ${
                        selectedCategory === category
                          ? `${categoryButtonColors[category]}`
                          : `${categoryButtonColors[category]} opacity-70 hover:opacity-85`
                      } ${index < categories.length - 1 ? 'border-r border-white/20' : ''}`}
                      style={{
                        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                      }}
                    >
                      {categoryLabels[category]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Themed Category Rows - YouVersion Style */}
              {/* Healing row - separate */}
              {(() => {
                const healingPlans = getPlansByCategory('healing')
                if (healingPlans.length > 0) {
                  return renderCategoryRow('healing', categoryLabels['healing'])
                }
                return null
              })()}
              
              {/* Combined row: Sabbath, Health, New to Faith */}
              {renderCombinedCategoryRow(['sabbath', 'health', 'new-believer'], 'Sabbath, Health & New to Faith')}
              
              {/* Other categories - separate rows */}
              {categories
                .filter(category => !['healing', 'sabbath', 'health', 'new-believer'].includes(category))
                .map((category) => {
                  const categoryPlans = getPlansByCategory(category)
                  if (categoryPlans.length === 0) return null
                  return renderCategoryRow(category, categoryLabels[category])
                })}
            </>
          ) : (
            /* My Plans, Saved, Completed - Horizontal Scrolling Rows */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800 dark:text-white">
                  {activeTab === 'my-plans' ? 'My Plans' : activeTab === 'saved' ? 'Saved Plans' : 'Completed Plans'}
                </h2>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
                </span>
              </div>
              {filteredPlans.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {activeTab === 'my-plans' && 'You haven\'t started any plans yet.'}
                    {activeTab === 'saved' && 'You haven\'t saved any plans yet.'}
                    {activeTab === 'completed' && 'You haven\'t completed any plans yet.'}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="hidden md:flex items-center justify-end mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const ref = activeTab === 'my-plans' ? myPlansScrollRef : activeTab === 'saved' ? savedScrollRef : completedScrollRef
                          scrollRow(ref, 'left')
                        }}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => {
                          const ref = activeTab === 'my-plans' ? myPlansScrollRef : activeTab === 'saved' ? savedScrollRef : completedScrollRef
                          scrollRow(ref, 'right')
                        }}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div
                    ref={activeTab === 'my-plans' ? myPlansScrollRef : activeTab === 'saved' ? savedScrollRef : completedScrollRef}
                    className="grid grid-cols-1 md:flex md:gap-3 md:gap-4 md:overflow-x-auto md:scrollbar-hide gap-4 md:gap-3 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredPlans.map((plan) => (
                      <div key={plan.id} className="w-full max-w-sm mx-auto md:max-w-none md:flex-shrink-0 md:w-64">
                        <ReadingPlanCard
                          plan={plan}
                          progress={planProgress[plan.id]}
                          isSaved={savedPlans.has(plan.id)}
                          onStart={() => handleStartPlan(plan.id)}
                          onContinue={() => handleContinuePlan(plan.id)}
                          onSave={() => handleSavePlan(plan.id)}
                          onUnsave={() => handleUnsavePlan(plan.id)}
                          size="small"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
