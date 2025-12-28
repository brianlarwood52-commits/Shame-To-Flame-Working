export type RiskLevel = 'low' | 'medium' | 'high'
export type Category = 'general' | 'prayer' | 'bible-study' | 'testimony' | 'crisis'

export function triageMessage(input: {
  requestType: string
  text: string
}): { risk_level: RiskLevel; category: Category; flags: string[] } {
  const flags: string[] = []

  const raw = input.text || ''
  const text = raw.toLowerCase()

  // Basic spam/link heuristics
  const urlCount = (text.match(/https?:\/\//g) || []).length
  if (urlCount >= 2) flags.push('many_links')
  if (/(free money|crypto|airdrop|forex|seo|backlinks)/i.test(raw)) flags.push('spam_keywords')
  if (raw.length > 5000) flags.push('very_long')
  if (/([a-zA-Z])\1{12,}/.test(raw)) flags.push('repeated_chars')

  // Crisis/self-harm heuristics (NOT a diagnosis; triage only)
  const crisisPatterns = [
    /\bkill myself\b/i,
    /\bsuicide\b/i,
    /\bend my life\b/i,
    /\bself[- ]?harm\b/i,
    /\bcan\'?t go on\b/i,
    /\bwant to die\b/i,
  ]
  const crisisHits = crisisPatterns.some((re) => re.test(raw))
  if (crisisHits) flags.push('possible_crisis_language')

  // Base category from UI requestType
  const rt = (input.requestType || '').toLowerCase()
  const category: Category =
    rt === 'prayer'
      ? 'prayer'
      : rt === 'bible-study'
        ? 'bible-study'
        : rt === 'testimony'
          ? 'testimony'
          : rt === 'crisis'
            ? 'crisis'
            : 'general'

  let risk_level: RiskLevel = 'low'
  if (category === 'crisis' || crisisHits) risk_level = 'high'
  else if (flags.includes('spam_keywords') || flags.includes('many_links')) risk_level = 'medium'

  return { risk_level, category, flags }
}
