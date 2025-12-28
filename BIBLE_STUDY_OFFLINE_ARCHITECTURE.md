# Bible Study Offline Architecture - Brainstorming Document

## Overview
Redesign the Bible Study page with offline-first reading plans, KJV offline support, and progress tracking - all aligned with SDA beliefs.

## Current State
- ✅ PWA already configured (`@ducanh2912/next-pwa`)
- ✅ KJV available in bibleVersions (ID: `06125adad2d5898a-01`)
- ✅ BibleReader component exists
- ✅ Using scripture.api.bible API
- ✅ Service Worker caching configured

## Architecture Requirements

### 1. Offline Storage Strategy

#### IndexedDB Structure
```
bible-study-db
├── plans (ObjectStore)
│   ├── planId (key)
│   ├── title
│   ├── description
│   ├── duration (days)
│   ├── category (healing, shame, hope, etc.)
│   ├── sdaAligned (boolean)
│   └── readings[] (array of daily readings)
│       ├── day (1-30, etc.)
│       ├── book
│       ├── chapter
│       ├── startVerse
│       ├── endVerse
│       └── reflection (optional)
│
├── progress (ObjectStore)
│   ├── planId (key)
│   ├── currentDay
│   ├── startedDate
│   ├── completedDays[] (array)
│   └── lastAccessed
│
├── kjv-text (ObjectStore)
│   ├── reference (key) - e.g., "GEN.1.1-31"
│   ├── book
│   ├── chapter
│   ├── verses (object with verse numbers as keys)
│   └── cachedDate
│
└── current-plan (ObjectStore)
    ├── id (key: "current")
    ├── planId
    ├── day
    └── lastUpdated
```

### 2. KJV Offline Strategy

#### Option A: Pre-download Full KJV (Recommended)
- Download entire KJV when user first selects KJV
- Store in IndexedDB by book/chapter/verse
- Size: ~4-5MB (compressed)
- Pros: Complete offline access
- Cons: Initial download time

#### Option B: Progressive Download
- Download chapters as user reads
- Cache current reading plan passages
- Pros: Faster initial load
- Cons: Limited offline access

#### Implementation:
1. Create `lib/kjv-offline.ts` service
2. Download KJV via API when online
3. Store in IndexedDB
4. BibleReader checks IndexedDB first, falls back to API

### 3. Reading Plan Structure

#### SDA-Aligned Plan Examples:
```typescript
{
  id: "healing-from-shame-30",
  title: "Healing from Shame: 30-Day Journey",
  description: "A Scripture-based journey to find freedom from shame through God's Word",
  duration: 30,
  category: "healing",
  sdaAligned: true,
  readings: [
    {
      day: 1,
      book: "PSA",
      chapter: 34,
      startVerse: 1,
      endVerse: 10,
      reflection: "God is near to the brokenhearted"
    },
    // ... 29 more days
  ]
}
```

#### Plan Categories (SDA-Aligned):
- **Healing Journey**: Shame, trauma, grief
- **Sabbath Studies**: Friday/Saturday focused
- **Prophecy Studies**: Daniel, Revelation
- **Health & Wellness**: SDA health message
- **New to Faith**: Basics for new believers
- **Advent Studies**: End-times, second coming
- **Character Studies**: Biblical heroes
- **Topical Studies**: Love, hope, forgiveness

### 4. Progress Tracking

#### Local Storage (IndexedDB)
- Track current plan
- Track current day
- Mark completed days
- Store notes/highlights (future)

#### Sync Strategy (Optional - Future)
- When online, sync to Supabase
- Allow cross-device progress
- For now: localStorage only (simpler)

### 5. UI/UX Flow

#### Page Layout:
```
┌─────────────────────────────────────┐
│  Hero: "Bible Study & Reading     │
│         Plans"                     │
│  [Search Bar]                      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Current Plan Card (if active)      │
│  ┌───────────────────────────────┐ │
│  │ Day 5 of 30: Psalm 34:1-10    │ │
│  │ [Continue Reading →]          │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Featured Plans (3-4 cards)         │
│  [Card] [Card] [Card]               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Category Filters                   │
│  [Healing] [Shame] [Hope] [Sabbath] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  All Plans Grid                     │
│  [Card] [Card] [Card] [Card]        │
│  [Card] [Card] [Card] [Card]        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Bible Reader (Always Visible)      │
│  [Integrated with current reading]   │
└─────────────────────────────────────┘
```

#### Plan Card Design:
```
┌─────────────────────────────┐
│ [Gradient: flame/sky]        │
│ ┌─────────┐                  │
│ │ 30 Days │ ← Badge          │
│ └─────────┘                  │
│                              │
│ Healing from Shame           │ ← Title
│ A journey through Scripture  │ ← Description
│ to find freedom...           │
│                              │
│ [Healing] [Shame] [SDA]      │ ← Tags
│                              │
│ Progress: ████░░░░ 13%       │ ← If started
│                              │
│ [Start Plan] or [Continue]   │ ← Button
└─────────────────────────────┘
```

### 6. Technical Implementation

#### New Files Needed:
```
lib/
├── indexeddb.ts          # IndexedDB wrapper/utilities
├── kjv-offline.ts         # KJV download/cache service
├── reading-plans.ts        # Plan definitions (SDA-aligned)
└── progress-tracker.ts     # Progress management

components/
├── ReadingPlanCard.tsx     # Plan card component
├── CurrentPlanWidget.tsx   # Active plan display
├── PlanReader.tsx          # Daily reading view
└── CategoryFilter.tsx      # Category chips

app/bible-study/
└── page.tsx                # Redesigned page
```

#### Service Worker Updates:
Add to `next.config.js` runtimeCaching:
```javascript
{
  urlPattern: ({ url }) => url.pathname.startsWith('/api/bible/'),
  handler: 'CacheFirst',
  options: {
    cacheName: 'bible-api',
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
    },
  },
}
```

### 7. SDA-Aligned Plan Ideas

#### Healing & Restoration:
1. "Healing from Shame" (30 days) - Psalms, Isaiah, Romans
2. "Finding Hope in Grief" (21 days) - Ecclesiastes, Lamentations, Revelation 21
3. "Overcoming Trauma" (40 days) - Joseph, Job, Jesus' healing ministry

#### Sabbath Studies:
4. "Sabbath Rest & Restoration" (12 weeks) - Genesis 2, Exodus 20, Hebrews 4
5. "Sabbath Preparation" (7 days) - Friday focus

#### Prophecy (SDA Core):
6. "Daniel's Prophecies" (70 days) - Full Daniel study
7. "Revelation Unveiled" (22 days) - Chapter by chapter
8. "The Three Angels' Messages" (14 days)

#### Health & Wellness:
9. "God's Health Principles" (30 days) - Leviticus, 1 Corinthians, SDA health message
10. "Temple of the Holy Spirit" (21 days)

#### New Believers:
11. "First Steps in Faith" (30 days) - Gospels, basics
12. "Understanding Salvation" (21 days) - Romans, Galatians

### 8. Implementation Phases

#### Phase 1: UI Redesign (Static)
- Redesign Bible Study page layout
- Create plan cards (static data)
- Category filters
- Keep existing BibleReader

#### Phase 2: IndexedDB Setup
- Create IndexedDB schema
- Build utilities for reading/writing
- Test offline storage

#### Phase 3: KJV Offline
- Build KJV download service
- Integrate with BibleReader
- Cache strategy

#### Phase 4: Reading Plans
- Define SDA-aligned plans (JSON)
- Plan selection/start
- Daily reading view

#### Phase 5: Progress Tracking
- Track current plan
- Mark days complete
- Progress indicators

#### Phase 6: Integration
- Link plans to BibleReader
- "Continue Reading" flow
- Offline-first experience

### 9. Data Sources

#### KJV Text:
- Option 1: scripture.api.bible (KJV ID: `06125adad2d5898a-01`)
- Option 2: Public domain KJV JSON (if available)
- Option 3: Download and bundle (larger initial load)

#### Reading Plans:
- Pre-defined JSON files in `/public/plans/`
- Or hardcoded in `lib/reading-plans.ts`
- SDA-aligned content

### 10. User Flow

1. **Browse Plans**: User sees all available plans
2. **Select Plan**: Click "Start Plan"
3. **Download KJV** (if not cached): Background download
4. **Day 1 Reading**: Shows today's passage
5. **BibleReader Integration**: Auto-loads passage
6. **Mark Complete**: Checkbox to mark day done
7. **Next Day**: Automatically advances
8. **Offline Access**: Everything works offline

### 11. Color Palette (Maintain Current)
- Flame: `#EA580C` (primary actions, highlights)
- Sky: `#0EA5E9` (secondary, calm)
- Sage: `#6B7B6B` (neutral, grounding)
- Gradients: `from-sky-50/90 to-flame-50/90`

### 12. Questions to Resolve

1. **KJV Download Size**: ~4-5MB acceptable? Or progressive?
2. **Plan Count**: How many initial plans? (Start with 5-10?)
3. **Plan Updates**: How to update plans? (Version system?)
4. **Notes/Highlights**: Include in Phase 1 or later?
5. **Sharing**: Allow users to share progress? (Future)

## Next Steps

1. ✅ Backup current BibleStudy.tsx (DONE)
2. Create IndexedDB utilities
3. Build KJV offline service
4. Define initial SDA-aligned plans
5. Redesign UI with plan cards
6. Integrate progress tracking
7. Test offline functionality

## Estimated File Sizes

- KJV Full Text: ~4-5MB (compressed)
- Reading Plans JSON: ~50-100KB (for 10 plans)
- Total Initial Download: ~5MB (one-time)

---

**Ready to proceed?** Let me know which phase you'd like to start with, or if you want to adjust any part of this architecture!
