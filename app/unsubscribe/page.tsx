'use client'

import React, { useState, FormEvent } from 'react'
import { Mail, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleUnsubscribe = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      // First, we need to find the subscription by email
      // Since we don't have a direct email lookup API, we'll need to create one
      // For now, we'll use a workaround: try to get the token from Supabase
      // But actually, we should create an API route for this
      
      const response = await fetch('/api/verse-of-day/unsubscribe-by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'You have been successfully unsubscribed from Verse of the Day emails.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to unsubscribe. Please try again or contact support.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again later or contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center text-flame-600 hover:text-flame-700 dark:text-flame-400 dark:hover:text-flame-300 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-flame-600 dark:bg-flame-700 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Unsubscribe from Verse of the Day
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  We're sorry to see you go. Enter your email address below to unsubscribe from daily verse emails.
                </p>
              </div>
            </div>

            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 bg-flame-600 hover:bg-flame-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Unsubscribe
                  </>
                )}
              </button>

              {message && (
                <div className={`flex items-start gap-2 p-4 rounded-lg ${
                  status === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  {status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${
                    status === 'success' 
                      ? 'text-green-800 dark:text-green-300' 
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {message}
                  </p>
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> If you subscribed using a different email address, please use that email to unsubscribe.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                If you're having trouble unsubscribing, please{' '}
                <Link href="/contact" className="text-flame-600 dark:text-flame-400 hover:underline">
                  contact us
                </Link>
                {' '}for assistance.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Changed your mind?{' '}
              <Link href="/" className="text-flame-600 dark:text-flame-400 hover:underline font-medium">
                Subscribe again
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}
