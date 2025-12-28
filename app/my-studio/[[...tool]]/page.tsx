// Server component wrapper for static export
import StudioClient from './StudioClient'

export const metadata = {
  title: 'Sanity Studio - Content Management | Shame to Flame',
  description: 'Content management system for Shame to Flame Ministry',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  // For catch-all route, return array with empty tool array
  return [{ tool: [] }]
}

export default function StudioPage() {
  return <StudioClient />
}