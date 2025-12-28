'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CollapsibleBibleReader from '../../src/components/CollapsibleBibleReader'

function BibleReaderContent() {
  const searchParams = useSearchParams()
  const ref = searchParams?.get('ref')

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/90 to-flame-50/90 dark:from-sky-900/30 dark:to-flame-900/30 backdrop-blur-md py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Bible Reader
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Enter a Bible reference to read the text
          </p>
        </div>
        <CollapsibleBibleReader initialReference={ref || undefined} />
      </div>
    </div>
  )
}

export default function BibleReaderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-sky-50/90 to-flame-50/90 dark:from-sky-900/30 dark:to-flame-900/30 backdrop-blur-md py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Bible Reader
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Enter a Bible reference to read the text
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20 dark:border-gray-700/50">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Use the form below to search for and read Bible verses. You can enter references like "John 3:16" or "Psalm 23" to view the text in multiple translations.
            </p>
          </div>
        </div>
      </div>
    }>
      <BibleReaderContent />
    </Suspense>
  )
}
