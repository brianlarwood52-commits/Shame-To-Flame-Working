'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export default function StudioClient() {
  // Verify config before rendering
  if (!config.projectId || !config.dataset) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Sanity Configuration Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Project ID: {config.projectId || 'Missing'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Dataset: {config.dataset || 'Missing'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Please check your .env.local file for NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
          </p>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}
