import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react'
import { getPathwayById, healingPathways } from '../../../src/data/healingPathways'

export function generateStaticParams() {
  return healingPathways.map((pathway) => ({
    id: pathway.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pathway = getPathwayById(id)
  
  return {
    title: pathway ? `${pathway.title} - Coming Soon | Shame to Flame` : 'Healing Pathway - Coming Soon | Shame to Flame',
    description: pathway ? `This healing pathway is currently under development. ${pathway.description}` : 'This healing pathway is currently under development. Check back soon for guided Bible studies and practical resources.',
  }
}

export default async function PathwayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pathway = getPathwayById(id)

    return (
      <div className="min-h-screen pt-16">
        <section className="py-20 bg-gradient-to-br from-sky-50/90 to-flame-50/90 dark:from-sky-900/30 dark:to-flame-900/30 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/healing-pathways"
              className="inline-flex items-center text-flame-600 hover:text-flame-700 dark:text-flame-400 dark:hover:text-flame-300 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Healing Pathways
            </Link>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20 dark:border-gray-700/50">
              <div className="text-center mb-8">
                <BookOpen className="h-16 w-16 text-flame-500 mx-auto mb-6" />
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                  {pathway ? pathway.title : 'Healing Pathway'}
                </h1>
                {pathway && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    {pathway.description}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-sky-50/90 to-flame-50/90 dark:from-sky-900/30 dark:to-flame-900/30 backdrop-blur-sm rounded-xl p-8 border border-white/20 dark:border-gray-700/50 mb-8">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-flame-500 mx-auto mb-4" />
                  <h2 className="font-serif text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Coming Soon
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-6 max-w-2xl mx-auto">
                    This healing pathway is currently under development. We're working hard to create 
                    comprehensive, trauma-informed resources that will guide you through biblical healing 
                    and practical steps toward wholeness.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    In the meantime, we invite you to explore our other resources:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <Link
                    href="/daily-fire"
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-flame-500 dark:hover:border-flame-500 hover:shadow-md transition-all duration-200 group"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-flame-600 dark:group-hover:text-flame-400 transition-colors">
                      Daily Fire
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Daily devotionals and encouragements to inspire hope each day
                    </p>
                  </Link>

                  <Link
                    href="/crisis-help"
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-flame-500 dark:hover:border-flame-500 hover:shadow-md transition-all duration-200 group"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-flame-600 dark:group-hover:text-flame-400 transition-colors">
                      Crisis Help
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Immediate help resources and crisis support hotlines
                    </p>
                  </Link>
                </div>
              </div>

              {pathway && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{pathway.estimatedWeeks} weeks</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{pathway.sessions.length} sessions</span>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                    This pathway will include {pathway.sessions.length} structured sessions designed to 
                    guide you through {pathway.estimatedWeeks} weeks of healing and growth.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    )
}
