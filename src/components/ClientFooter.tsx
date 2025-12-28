'use client'  // ← makes this a Client Component

import dynamic from 'next/dynamic'

// Dynamically load your real Footer, only on client
const DynamicFooter = dynamic(() => import('./Footer'), { ssr: false })

export default function ClientFooter() {
  return <DynamicFooter />
}