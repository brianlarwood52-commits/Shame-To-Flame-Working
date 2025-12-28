'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

// Get project ID and dataset from environment variables
// NEXT_PUBLIC_ variables are available in client components
function getEnvVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use process.env directly
    const value = process.env[name] || fallback
    return String(value).replace(/^["']|["']$/g, '')
  }
  
  // Client-side: NEXT_PUBLIC_ vars are available at runtime
  // Access via window or process.env (Next.js makes them available)
  const value = process.env[name] || fallback
  return String(value).replace(/^["']|["']$/g, '')
}

const projectId = getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID', 'rwfrkr9i')
const dataset = getEnvVar('NEXT_PUBLIC_SANITY_DATASET', 'production')

// Debug: Log the values
if (typeof window !== 'undefined') {
  console.log('Sanity Config:', { 
    projectId, 
    dataset,
    envProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    envDataset: process.env.NEXT_PUBLIC_SANITY_DATASET
  })
}

const config = defineConfig({
  basePath: '/my-studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],
})

// Validate configuration
if (!projectId || projectId === 'undefined' || projectId === '') {
  console.error('❌ Sanity projectId is missing or invalid:', projectId)
}

if (!dataset || dataset === 'undefined' || dataset === '') {
  console.error('❌ Sanity dataset is missing or invalid:', dataset)
}

export default config