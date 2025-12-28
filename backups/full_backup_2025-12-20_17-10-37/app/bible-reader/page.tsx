import CollapsibleBibleReader from '../../src/components/CollapsibleBibleReader'

export const metadata = {
  title: 'Bible Reader - Read Scripture | Shame to Flame',
  description: 'Read and search the Bible with our easy-to-use Bible reader. Enter any Bible reference to view the text.',
}

export default function BibleReaderPage() {
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
        <CollapsibleBibleReader />
      </div>
    </div>
  )
}
