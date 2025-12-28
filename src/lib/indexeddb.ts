// IndexedDB utilities for Bible Study offline storage

const DB_NAME = 'bible-study-db'
const DB_VERSION = 2 // Incremented to add saved-plans store

export interface ScriptureReference {
  book: string
  chapter: number
  verse?: number
  startVerse?: number
  endVerse?: number
}

export interface PlanData {
  planId: string
  title: string
  description: string
  duration: number
  category: string
  sdaAligned: boolean
  readings: Array<{
    day: number
    dayTitle?: string
    devotional: string
    scripture: ScriptureReference[]
  }>
}

export interface ProgressData {
  planId: string
  currentDay: number
  startedDate: string // ISO date string
  completedDays: number[]
  lastAccessed: string // ISO date string
}

export interface KJVTextData {
  reference: string // e.g., "GEN.1.1-31"
  book: string
  chapter: number
  verses: Record<number, string> // verse number -> text
  cachedDate: string
}

export interface CurrentPlanData {
  id: 'current'
  planId: string
  day: number
  lastUpdated: string
}

export interface SavedPlanData {
  planId: string
  savedDate: string
}

class IndexedDBService {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    // Check if we're in the browser
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB is not available (server-side rendering)')
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        const error = request.error
        // If error is version mismatch, try to handle it gracefully
        if (error && error.name === 'VersionError') {
          console.warn('Version mismatch detected. Attempting to open with existing version...')
          // Try opening without specifying version to get current version
          const checkRequest = indexedDB.open(DB_NAME)
          checkRequest.onsuccess = () => {
            const currentVersion = checkRequest.result.version
            checkRequest.result.close()
            // If current version is higher, open with that version
            if (currentVersion >= DB_VERSION) {
              const reopenRequest = indexedDB.open(DB_NAME, currentVersion)
              reopenRequest.onsuccess = () => {
                this.db = reopenRequest.result
                console.log(`Opened database with existing version ${currentVersion}`)
                resolve()
              }
              reopenRequest.onerror = () => {
                console.error('Failed to open with existing version:', reopenRequest.error)
                // Still resolve - database exists, we just can't upgrade it
                resolve()
              }
            } else {
              // Current version is lower, try to upgrade
              const upgradeRequest = indexedDB.open(DB_NAME, DB_VERSION)
              upgradeRequest.onsuccess = () => {
                this.db = upgradeRequest.result
                resolve()
              }
              upgradeRequest.onerror = () => {
                console.error('Failed to upgrade database:', upgradeRequest.error)
                resolve() // Don't block - allow page to render
              }
              upgradeRequest.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                const oldVersion = event.oldVersion || 0
                this.handleUpgrade(db, oldVersion)
              }
            }
          }
          checkRequest.onerror = () => {
            console.error('Failed to check database version:', checkRequest.error)
            resolve() // Don't block - allow page to render without IndexedDB
          }
        } else {
          console.error('IndexedDB error:', error)
          // Don't reject - allow page to render without IndexedDB
          resolve()
        }
      }
      
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const oldVersion = event.oldVersion || 0
        this.handleUpgrade(db, oldVersion)
      }
    })
  }

  private handleUpgrade(db: IDBDatabase, oldVersion: number): void {
    // Plans store
    if (!db.objectStoreNames.contains('plans')) {
      const plansStore = db.createObjectStore('plans', { keyPath: 'planId' })
      plansStore.createIndex('category', 'category', { unique: false })
    }

    // Progress store
    if (!db.objectStoreNames.contains('progress')) {
      const progressStore = db.createObjectStore('progress', { keyPath: 'planId' })
      progressStore.createIndex('lastAccessed', 'lastAccessed', { unique: false })
    }

    // KJV text store
    if (!db.objectStoreNames.contains('kjv-text')) {
      const kjvStore = db.createObjectStore('kjv-text', { keyPath: 'reference' })
      kjvStore.createIndex('book', 'book', { unique: false })
      kjvStore.createIndex('chapter', 'chapter', { unique: false })
    }

    // Current plan store
    if (!db.objectStoreNames.contains('current-plan')) {
      db.createObjectStore('current-plan', { keyPath: 'id' })
    }

    // Saved plans store (added in version 2)
    if (oldVersion < 2 && !db.objectStoreNames.contains('saved-plans')) {
      const savedStore = db.createObjectStore('saved-plans', { keyPath: 'planId' })
      savedStore.createIndex('savedDate', 'savedDate', { unique: false })
    }
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB')
    }
    return this.db
  }

  // Plans
  async savePlan(plan: PlanData): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['plans'], 'readwrite')
      const store = transaction.objectStore('plans')
      const request = store.put(plan)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPlan(planId: string): Promise<PlanData | null> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['plans'], 'readonly')
      const store = transaction.objectStore('plans')
      const request = store.get(planId)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllPlans(): Promise<PlanData[]> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['plans'], 'readonly')
      const store = transaction.objectStore('plans')
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  // Progress
  async saveProgress(progress: ProgressData): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['progress'], 'readwrite')
      const store = transaction.objectStore('progress')
      const request = store.put(progress)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getProgress(planId: string): Promise<ProgressData | null> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['progress'], 'readonly')
      const store = transaction.objectStore('progress')
      const request = store.get(planId)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async updateProgressDay(planId: string, day: number, completed: boolean): Promise<void> {
    const progress = await this.getProgress(planId)
    if (!progress) {
      throw new Error('Progress not found')
    }

    if (completed) {
      if (!progress.completedDays.includes(day)) {
        progress.completedDays.push(day)
      }
    } else {
      progress.completedDays = progress.completedDays.filter(d => d !== day)
    }

    progress.currentDay = Math.max(progress.currentDay, day)
    progress.lastAccessed = new Date().toISOString()

    await this.saveProgress(progress)
  }

  // Current Plan
  async setCurrentPlan(planId: string, day: number): Promise<void> {
    const db = await this.ensureDB()
    const currentPlan: CurrentPlanData = {
      id: 'current',
      planId,
      day,
      lastUpdated: new Date().toISOString(),
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['current-plan'], 'readwrite')
      const store = transaction.objectStore('current-plan')
      const request = store.put(currentPlan)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCurrentPlan(): Promise<CurrentPlanData | null> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['current-plan'], 'readonly')
      const store = transaction.objectStore('current-plan')
      const request = store.get('current')
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  // KJV Text
  async saveKJVText(data: KJVTextData): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['kjv-text'], 'readwrite')
      const store = transaction.objectStore('kjv-text')
      const request = store.put(data)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getKJVText(reference: string): Promise<KJVTextData | null> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['kjv-text'], 'readonly')
      const store = transaction.objectStore('kjv-text')
      const request = store.get(reference)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getKJVChapter(book: string, chapter: number): Promise<KJVTextData | null> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['kjv-text'], 'readonly')
      const store = transaction.objectStore('kjv-text')
      const index = store.index('book')
      const request = index.getAll()
      
      request.onsuccess = () => {
        const results = request.result as KJVTextData[]
        const match = results.find(
          r => r.book === book && r.chapter === chapter
        )
        resolve(match || null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async hasKJVText(reference: string): Promise<boolean> {
    const text = await this.getKJVText(reference)
    return text !== null
  }

  // Utility: Check if KJV is downloaded
  async isKJVDownloaded(): Promise<boolean> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['kjv-text'], 'readonly')
      const store = transaction.objectStore('kjv-text')
      const request = store.count()
      request.onsuccess = () => {
        // Consider KJV downloaded if we have at least 10 chapters cached
        resolve(request.result >= 10)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Saved Plans
  async savePlanToSaved(planId: string): Promise<void> {
    const db = await this.ensureDB()
    
    // Check if store exists (for databases that haven't upgraded yet)
    if (!db.objectStoreNames.contains('saved-plans')) {
      // Reinitialize to trigger upgrade
      await this.init()
      const newDb = await this.ensureDB()
      if (!newDb.objectStoreNames.contains('saved-plans')) {
        throw new Error('Saved plans store not available')
      }
    }
    
    const savedPlan: SavedPlanData = {
      planId,
      savedDate: new Date().toISOString(),
    }
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['saved-plans'], 'readwrite')
        const store = transaction.objectStore('saved-plans')
        const request = store.put(savedPlan)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      } catch (error) {
        reject(error)
      }
    })
  }

  async removeSavedPlan(planId: string): Promise<void> {
    const db = await this.ensureDB()
    
    // Check if store exists (for databases that haven't upgraded yet)
    if (!db.objectStoreNames.contains('saved-plans')) {
      return // Nothing to remove
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['saved-plans'], 'readwrite')
        const store = transaction.objectStore('saved-plans')
        const request = store.delete(planId)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      } catch (error) {
        reject(error)
      }
    })
  }

  async getSavedPlans(): Promise<string[]> {
    const db = await this.ensureDB()
    
    // Check if store exists (for databases that haven't upgraded yet)
    if (!db.objectStoreNames.contains('saved-plans')) {
      return []
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['saved-plans'], 'readonly')
        const store = transaction.objectStore('saved-plans')
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result.map((p: SavedPlanData) => p.planId))
        request.onerror = () => reject(request.error)
      } catch (error) {
        // Store doesn't exist yet, return empty array
        resolve([])
      }
    })
  }

  async isPlanSaved(planId: string): Promise<boolean> {
    const db = await this.ensureDB()
    
    // Check if store exists (for databases that haven't upgraded yet)
    if (!db.objectStoreNames.contains('saved-plans')) {
      return false
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['saved-plans'], 'readonly')
        const store = transaction.objectStore('saved-plans')
        const request = store.get(planId)
        request.onsuccess = () => resolve(!!request.result)
        request.onerror = () => reject(request.error)
      } catch (error) {
        // Store doesn't exist yet, return false
        resolve(false)
      }
    })
  }
}

// Export singleton instance
export const dbService = new IndexedDBService()

// Don't auto-initialize - let components handle initialization
// This prevents SSR issues
