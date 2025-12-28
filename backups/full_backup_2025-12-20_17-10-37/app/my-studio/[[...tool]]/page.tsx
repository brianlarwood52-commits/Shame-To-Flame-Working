// Server component wrapper for static export
import StudioClient from './StudioClient'

export function generateStaticParams() {
  // For catch-all route, return array with empty tool array
  return [{ tool: [] }]
}

export default function StudioPage() {
  return <StudioClient />
}