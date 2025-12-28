'use client'

import { useState, useEffect } from 'react'
import { Shield, Mail, Heart, Trash2, CheckCircle, Clock, Eye, Lock, Key } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string | null
  email: string | null
  request_type: string
  subject: string | null
  message: string | null
  encrypted_message: string | null
  encryption_iv: string | null
  category: string
  risk_level: string
  flags: string[]
  created_at: string
  status: string
}

interface PrayerRequest {
  id: string
  name: string | null
  email: string | null
  is_anonymous: boolean
  prayer_request: string | null
  encrypted_message: string | null
  encryption_iv: string | null
  category: string
  risk_level: string
  flags: string[]
  allow_sharing: boolean
  created_at: string
  status: string
}

type AuthStep = 'password' | 'email' | 'code' | 'authenticated'

export default function AdminWith2FA() {
  // Get admin email from environment variable (must be set)
  const adminEmailEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  
  const [authStep, setAuthStep] = useState<AuthStep>('password')
  const [password, setPassword] = useState('')
  const [adminEmail, setAdminEmail] = useState(adminEmailEnv)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [activeTab, setActiveTab] = useState<'contacts' | 'prayers'>('contacts')
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | PrayerRequest | null>(null)
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({})

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ShameToFlame2024!'
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'contact@shametoflame.faith'

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password === ADMIN_PASSWORD) {
      setAuthStep('email')
      setPassword('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/send-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail }),
      })

      const data = await res.json()
      if (data.success) {
        setAuthStep('code')
        // In development, show the code prominently if email sending failed
        if (data.devCode) {
          console.log(`[DEV] 2FA Code for ${adminEmail}: ${data.devCode}`)
          // Show code in a visible way during development
          setTimeout(() => {
            alert(`🔐 Your 2FA Code: ${data.devCode}\n\n(Development mode - email not configured or failed. Check your email inbox if RESEND_API_KEY is set.)`)
          }, 100)
        } else {
          // Email was sent successfully
          setError('') // Clear any previous errors
        }
      } else {
        setError(data.error || 'Failed to send code')
      }
    } catch (err) {
      setError('Failed to send 2FA code')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, code: twoFactorCode }),
      })

      const data = await res.json()
      if (data.success) {
        setAuthStep('authenticated')
        loadData()
      } else {
        setError(data.error || 'Invalid code')
      }
    } catch (err) {
      setError('Failed to verify code')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      if (data.success) {
        console.log('Loaded contacts:', data.contacts?.length, 'prayers:', data.prayers?.length)
        setContacts(data.contacts || [])
        setPrayers(data.prayers || [])
      } else {
        console.error('Failed to load data:', data.error, data.details)
        setError(data.error || 'Failed to load messages')
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load messages. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const decryptMessage = async (item: ContactSubmission | PrayerRequest): Promise<string | null> => {
    if (!item.encrypted_message || !item.encryption_iv) {
      if ('message' in item) {
        return item.message || null
      }
      return (item as PrayerRequest).prayer_request || null
    }

    // Check cache
    const cacheKey = `${item.id}`
    if (decryptedMessages[cacheKey]) {
      return decryptedMessages[cacheKey]
    }

    try {
      const res = await fetch('/api/admin/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ciphertext_b64: item.encrypted_message,
          iv_b64: item.encryption_iv,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setDecryptedMessages((prev) => ({ ...prev, [cacheKey]: data.plaintext }))
        return data.plaintext
      }
    } catch (err) {
      console.error('Decryption error:', err)
    }

    return '[Unable to decrypt]'
  }

  const updateStatus = async (type: 'contact' | 'prayer', id: string, newStatus: string) => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey) return

      const table = type === 'contact' ? 'contact_submissions' : 'prayer_requests'
      await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      loadData()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const deleteItem = async (type: 'contact' | 'prayer', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey) return

      const table = type === 'contact' ? 'contact_submissions' : 'prayer_requests'
      await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })
      loadData()
      setSelectedItem(null)
    } catch (err) {
      console.error('Error deleting item:', err)
    }
  }

  useEffect(() => {
    if (authStep === 'authenticated') {
      const interval = setInterval(loadData, 30000)
      return () => clearInterval(interval)
    }
  }, [authStep])

  // Load decrypted message when item is selected
  useEffect(() => {
    if (selectedItem && selectedItem.encrypted_message) {
      decryptMessage(selectedItem)
    }
  }, [selectedItem])

  // Login screens
  if (authStep === 'password') {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Admin Access</h1>
            <p className="text-center text-gray-600 mb-6">Step 1: Enter your password</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (authStep === 'email') {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-full">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Two-Factor Authentication</h1>
            <p className="text-center text-gray-600 mb-6">Step 2: Confirm your email address</p>

            {!adminEmailEnv && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-red-800 text-center">
                  <strong>Error:</strong> Admin email not configured. Add NEXT_PUBLIC_ADMIN_EMAIL to .env.local
                </p>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={adminEmail}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700"
                  placeholder="Admin email address"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  This email is configured for admin access
                </p>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send 2FA Code'}
              </button>
              <button
                type="button"
                onClick={() => setAuthStep('password')}
                className="w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to password
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (authStep === 'code') {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-full">
                <Key className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Verify Code</h1>
            <p className="text-center text-gray-600 mb-4">
              Step 3: Enter the 10-character code sent to <strong>{adminEmail}</strong>
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800 text-center">
                  <strong>Dev Mode:</strong> Check your browser console or the alert popup for the code.
                </p>
              </div>
            )}

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => {
                    // Allow alphanumeric and symbols: A-Z, a-z, 0-9, !@#$%&*
                    const input = e.target.value
                    const filtered = input.replace(/[^A-Za-z0-9!@#$%&*]/g, '').slice(0, 10)
                    setTwoFactorCode(filtered)
                  }}
                  placeholder="Enter 10-character code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-xl tracking-wider font-mono uppercase"
                  maxLength={10}
                  autoComplete="off"
                  autoFocus
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Code contains letters, numbers, and symbols
                </p>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || twoFactorCode.length !== 10}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthStep('email')
                  setTwoFactorCode('')
                }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Resend code
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - show dashboard (rest of the component stays the same as before, but with decryption)
  return (
    <div className="animate-fade-in pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage contact submissions and prayer requests</p>
          </div>
          <button
            onClick={() => {
              setAuthStep('password')
              setSelectedItem(null)
              setDecryptedMessages({})
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'contacts'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Mail className="w-5 h-5" />
            Contact Forms ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('prayers')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'prayers'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Heart className="w-5 h-5" />
            Prayer Requests ({prayers.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeTab === 'contacts' ? (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {contacts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              No contact submissions yet
                            </td>
                          </tr>
                        ) : (
                          contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-orange-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {contact.name || 'Anonymous'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{contact.email || '-'}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                  {contact.request_type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(contact.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    contact.status === 'new'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {contact.status === 'new' ? (
                                    <Clock className="w-3 h-3 inline mr-1" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                  )}
                                  {contact.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={() => setSelectedItem(contact)}
                                  className="text-orange-600 hover:text-orange-700 font-medium"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {prayers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              No prayer requests yet
                            </td>
                          </tr>
                        ) : (
                          prayers.map((prayer) => (
                            <tr key={prayer.id} className="hover:bg-orange-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {prayer.is_anonymous || !prayer.name ? 'Anonymous' : prayer.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {prayer.is_anonymous || !prayer.email ? '-' : prayer.email}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                  {prayer.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(prayer.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    prayer.status === 'new'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {prayer.status === 'new' ? (
                                    <Clock className="w-3 h-3 inline mr-1" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                  )}
                                  {prayer.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={() => setSelectedItem(prayer)}
                                  className="text-orange-600 hover:text-orange-700 font-medium"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {selectedItem ? (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 sticky top-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Details
                    {selectedItem.encrypted_message && (
                      <span title="Encrypted message">
                        <Lock className="w-4 h-4 text-orange-600" />
                      </span>
                    )}
                  </h3>

                  {'subject' in selectedItem ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Name</label>
                        <p className="text-gray-900">{selectedItem.name || 'Anonymous'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedItem.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Type</label>
                        <p className="text-gray-900">{selectedItem.request_type}</p>
                      </div>
                      {selectedItem.subject && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Subject</label>
                          <p className="text-gray-900">{selectedItem.subject}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Message</label>
                        <MessageDisplay
                          item={selectedItem}
                          decryptedMessages={decryptedMessages}
                          onDecrypt={decryptMessage}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Received</label>
                        <p className="text-gray-900">{new Date(selectedItem.created_at).toLocaleString()}</p>
                      </div>
                      {selectedItem.risk_level && selectedItem.risk_level !== 'low' && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Risk Level</label>
                          <p className={`text-sm font-medium ${
                            selectedItem.risk_level === 'high' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {selectedItem.risk_level.toUpperCase()}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 space-y-2 border-t">
                        {selectedItem.status === 'new' && (
                          <button
                            onClick={() => updateStatus('contact', selectedItem.id, 'handled')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Mark as Handled
                          </button>
                        )}
                        {selectedItem.status === 'handled' && (
                          <button
                            onClick={() => updateStatus('contact', selectedItem.id, 'new')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <Clock className="w-5 h-5" />
                            Mark as New
                          </button>
                        )}
                        <button
                          onClick={() => deleteItem('contact', selectedItem.id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Name</label>
                        <p className="text-gray-900">
                          {selectedItem.is_anonymous || !selectedItem.name ? 'Anonymous' : selectedItem.name}
                        </p>
                      </div>
                      {!selectedItem.is_anonymous && selectedItem.email && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Email</label>
                          <p className="text-gray-900">{selectedItem.email}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Prayer Request</label>
                        <MessageDisplay
                          item={selectedItem}
                          decryptedMessages={decryptedMessages}
                          onDecrypt={decryptMessage}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Sharing</label>
                        <p className="text-gray-900">
                          {selectedItem.allow_sharing ? 'Allowed to share' : 'Keep private'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Received</label>
                        <p className="text-gray-900">{new Date(selectedItem.created_at).toLocaleString()}</p>
                      </div>
                      {selectedItem.risk_level && selectedItem.risk_level !== 'low' && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Risk Level</label>
                          <p className={`text-sm font-medium ${
                            selectedItem.risk_level === 'high' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {selectedItem.risk_level.toUpperCase()}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 space-y-2 border-t">
                        {selectedItem.status === 'new' && (
                          <button
                            onClick={() => updateStatus('prayer', selectedItem.id, 'prayed')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Mark as Prayed
                          </button>
                        )}
                        {selectedItem.status === 'prayed' && (
                          <button
                            onClick={() => updateStatus('prayer', selectedItem.id, 'new')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <Clock className="w-5 h-5" />
                            Mark as New
                          </button>
                        )}
                        <button
                          onClick={() => deleteItem('prayer', selectedItem.id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 sticky top-6">
                  <p className="text-center text-gray-500">Select an item to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component to display messages (handles decryption)
function MessageDisplay({
  item,
  decryptedMessages,
  onDecrypt,
}: {
  item: ContactSubmission | PrayerRequest
  decryptedMessages: Record<string, string>
  onDecrypt: (item: ContactSubmission | PrayerRequest) => Promise<string | null>
}) {
  const [isDecrypting, setIsDecrypting] = useState(false)
  const cacheKey = item.id
  const cached = decryptedMessages[cacheKey]

  useEffect(() => {
    if (item.encrypted_message && !cached) {
      setIsDecrypting(true)
      onDecrypt(item).finally(() => setIsDecrypting(false))
    }
  }, [item, cached, onDecrypt])

  if (item.encrypted_message) {
    if (isDecrypting) {
      return (
        <div className="text-gray-500 italic">
          <div className="animate-pulse">Decrypting...</div>
        </div>
      )
    }
    if (cached) {
      return <p className="text-gray-900 whitespace-pre-wrap">{cached}</p>
    }
    return <p className="text-gray-500 italic">Click to decrypt...</p>
  }

  // Fallback to plaintext if available
  let plaintext: string | null = null
  if ('message' in item) {
    plaintext = item.message
  } else {
    plaintext = item.prayer_request
  }
  return <p className="text-gray-900 whitespace-pre-wrap">{plaintext || '[No message]'}</p>
}
