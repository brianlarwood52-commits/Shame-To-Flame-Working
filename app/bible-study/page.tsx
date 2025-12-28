import BibleStudy from '../../src/old_pages_backup/BibleStudy'

export const metadata = {
  title: 'Bible Study Library - Free Scripture Study Tools | Shame to Flame',
  description: 'Access comprehensive Bible study resources including topical studies, verse search, and biblical commentary to deepen your understanding of God\'s Word and healing promises.',
  keywords: ['Bible study', 'Scripture study', 'Bible reading plans', 'daily devotionals', 'Bible commentary', 'Christian study resources', 'offline Bible study'],
  robots: 'index, follow',
  openGraph: {
    title: 'Bible Study Library - Free Scripture Study Tools',
    description: 'Comprehensive Bible study resources, topical studies, and biblical commentary for spiritual growth and healing.',
    type: 'website',
  },
}

export default function Page() {
  return <BibleStudy />
}
