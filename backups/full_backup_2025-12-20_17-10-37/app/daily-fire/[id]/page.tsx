import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { getDevotionalById, devotionals, getTodaysDevotional } from '../../../src/data/dailyFireDevotionals';

export async function generateStaticParams() {
  return devotionals.map((devotional) => ({
    id: devotional.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const devotional = getDevotionalById(parseInt(id));

  if (!devotional) {
    return {
      title: 'Devotional Not Found',
    };
  }

  return {
    title: `${devotional.title} - Daily Fire | Shame to Flame`,
    description: devotional.message[0].substring(0, 160),
    openGraph: {
      title: `${devotional.title} - Daily Fire`,
      description: devotional.message[0].substring(0, 160),
      type: 'article',
    },
  };
}

export default async function DevotionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const devotional = getDevotionalById(parseInt(id));

  if (!devotional) {
    notFound();
  }

  const todaysDevotional = getTodaysDevotional();
  const isToday = todaysDevotional.id === devotional.id;

  const relatedDevotionals = devotionals
    .filter(d => d.category === devotional.category && d.id !== devotional.id)
    .slice(0, 3);

  const devotionalSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": devotional.title,
    "description": devotional.message[0].substring(0, 160),
    "author": {
      "@type": "Organization",
      "name": "Shame to Flame Ministry"
    },
    "datePublished": devotional.date,
    "publisher": {
      "@type": "Organization",
      "name": "Shame to Flame Ministry",
      "url": "https://shametoflame.faith",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shametoflame.faith/flame-icon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://shametoflame.faith/daily-fire/${devotional.id}`
    },
    "articleSection": devotional.category,
    "keywords": `daily devotional, ${devotional.category.toLowerCase()}, christian encouragement, biblical hope`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(devotionalSchema) }}
      />
      <div className="animate-fade-in">
      <section className="py-12 bg-gradient-to-br from-flame-50 via-orange-50 to-yellow-50 dark:from-flame-900/30 dark:via-orange-900/30 dark:to-yellow-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/daily-fire"
            className="inline-flex items-center text-flame-600 dark:text-flame-400 hover:text-flame-700 dark:hover:text-flame-300 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Daily Fire
          </Link>

          <div className="flex items-center gap-4 mb-4">
            {isToday && (
              <span className="bg-flame-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Today's Fire
              </span>
            )}
            <span className="bg-white dark:bg-gray-800 px-4 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Day {devotional.id}
            </span>
            <span className="bg-white dark:bg-gray-800 px-4 py-1 rounded-full text-sm font-medium text-flame-600 dark:text-flame-400">
              {devotional.category}
            </span>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-flame-500 rounded-full flex items-center justify-center animate-float">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            {devotional.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {devotional.date}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {devotional.readTime} read
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            <blockquote className="border-l-4 border-flame-300 pl-6 mb-8 bg-gradient-to-r from-flame-50 to-orange-50 dark:from-flame-900/30 dark:to-orange-900/30 rounded-r-lg p-6">
              <p className="font-serif text-xl text-gray-700 dark:text-gray-200 italic mb-3">
                "{devotional.scripture.text}"
              </p>
              <cite className="text-flame-600 dark:text-flame-400 font-semibold text-lg">
                - {devotional.scripture.reference}
              </cite>
            </blockquote>

            {devotional.message.map((paragraph, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-200 leading-relaxed mb-6 text-lg">
                {paragraph}
              </p>
            ))}

            <div className="bg-flame-100 dark:bg-flame-900/30 rounded-xl p-6 mb-8">
              <h2 className="font-serif text-2xl font-semibold text-flame-800 dark:text-flame-300 mb-3">
                Today's Reflection
              </h2>
              <p className="text-flame-700 dark:text-flame-300 text-lg leading-relaxed">
                {devotional.reflection}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
              <h2 className="font-serif text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                Prayer for Today
              </h2>
              <p className="text-gray-700 dark:text-gray-200 italic text-lg leading-relaxed">
                {devotional.prayer}
              </p>
            </div>
          </article>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit-prayer"
              className="bg-flame-600 hover:bg-flame-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200 text-center"
            >
              Submit a Prayer Request
            </Link>
            <Link
              href="/healing-pathways"
              className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-200 text-center"
            >
              Explore Healing Pathways
            </Link>
          </div>
        </div>
      </section>

      {relatedDevotionals.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-sky-50 to-flame-50 dark:from-sky-900/30 dark:to-flame-900/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">
              More on {devotional.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedDevotionals.map((related) => (
                <Link key={related.id} href={`/daily-fire/${related.id}`}>
                  <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer h-full">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Day {related.id}</span>
                        <span className="text-xs text-flame-600 dark:text-flame-400">{related.readTime}</span>
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-gray-800 dark:text-white mb-2 hover:text-flame-600 dark:hover:text-flame-400 transition-colors duration-200">
                        {related.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {related.message[0]}
                      </p>

                      <span className="text-sm text-sky-600 dark:text-sky-400 font-medium">
                        {related.scripture.reference}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/daily-fire"
                className="inline-flex items-center text-flame-600 dark:text-flame-400 hover:text-flame-700 dark:hover:text-flame-300 font-medium"
              >
                View All Daily Fires
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
}
