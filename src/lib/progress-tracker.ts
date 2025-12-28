// Progress Tracker - Manages reading plan progress

import { dbService, ProgressData } from './indexeddb'
import { ReadingPlan } from '../data/readingPlans'

class ProgressTracker {
  /**
   * Start a new reading plan
   */
  async startPlan(plan: ReadingPlan): Promise<void> {
    const progress: ProgressData = {
      planId: plan.id,
      currentDay: 1,
      startedDate: new Date().toISOString(),
      completedDays: [],
      lastAccessed: new Date().toISOString(),
    }

    await dbService.saveProgress(progress)
    await dbService.setCurrentPlan(plan.id, 1)

    // Also save the plan data to IndexedDB for offline access
    await dbService.savePlan({
      planId: plan.id,
      title: plan.title,
      description: plan.description,
      duration: plan.duration,
      category: plan.category,
      sdaAligned: plan.sdaAligned,
      readings: plan.readings.map(r => ({
        day: r.day,
        dayTitle: r.dayTitle,
        devotional: r.devotional,
        scripture: r.scripture,
      })),
    })
  }

  /**
   * Get current active plan
   */
  async getCurrentPlan(): Promise<{ progress: ProgressData | null }> {
    const current = await dbService.getCurrentPlan()
    if (!current) {
      return { progress: null }
    }

    const progress = await dbService.getProgress(current.planId)
    if (!progress) {
      return { progress: null }
    }

    return { progress }
  }

  /**
   * Mark a day as complete
   */
  async completeDay(planId: string, day: number): Promise<void> {
    await dbService.updateProgressDay(planId, day, true)
    
    // Update current plan if this is the active plan
    const current = await dbService.getCurrentPlan()
    if (current && current.planId === planId) {
      await dbService.setCurrentPlan(planId, day + 1)
    }
  }

  /**
   * Mark a day as incomplete
   */
  async uncompleteDay(planId: string, day: number): Promise<void> {
    await dbService.updateProgressDay(planId, day, false)
  }

  /**
   * Get progress percentage for a plan
   */
  async getProgressPercentage(planId: string): Promise<number> {
    const progress = await dbService.getProgress(planId)
    if (!progress) {
      return 0
    }

    // Get plan to know total days
    const plan = await dbService.getPlan(planId)
    if (!plan) {
      return 0
    }

    return Math.round((progress.completedDays.length / plan.duration) * 100)
  }

  /**
   * Get today's reading for current plan
   */
  async getTodaysReading(): Promise<{
    planId: string
    day: number
    reading: {
      book: string
      chapter: number
      startVerse: number
      endVerse: number
      reflection?: string
    }
  } | null> {
    const current = await dbService.getCurrentPlan()
    if (!current) {
      return null
    }

    const plan = await dbService.getPlan(current.planId)
    if (!plan) {
      return null
    }

    const reading = plan.readings.find(r => r.day === current.day)
    if (!reading) {
      return null
    }

    return {
      planId: current.planId,
      day: current.day,
      reading: {
        book: reading.scripture[0]?.book || '',
        chapter: reading.scripture[0]?.chapter || 1,
        startVerse: reading.scripture[0]?.startVerse || reading.scripture[0]?.verse || 1,
        endVerse: reading.scripture[0]?.endVerse || reading.scripture[0]?.verse || 1,
        reflection: reading.devotional,
      },
    }
  }

  /**
   * Advance to next day
   */
  async nextDay(planId: string): Promise<void> {
    const progress = await dbService.getProgress(planId)
    if (!progress) {
      throw new Error('Plan not started')
    }

    const plan = await dbService.getPlan(planId)
    if (!plan) {
      throw new Error('Plan data not found')
    }

    if (progress.currentDay < plan.duration) {
      progress.currentDay++
      progress.lastAccessed = new Date().toISOString()
      await dbService.saveProgress(progress)
      await dbService.setCurrentPlan(planId, progress.currentDay)
    }
  }

  /**
   * Go to previous day
   */
  async previousDay(planId: string): Promise<void> {
    const progress = await dbService.getProgress(planId)
    if (!progress) {
      throw new Error('Plan not started')
    }

    if (progress.currentDay > 1) {
      progress.currentDay--
      progress.lastAccessed = new Date().toISOString()
      await dbService.saveProgress(progress)
      await dbService.setCurrentPlan(progress.planId, progress.currentDay)
    }
  }
}

export const progressTracker = new ProgressTracker()
