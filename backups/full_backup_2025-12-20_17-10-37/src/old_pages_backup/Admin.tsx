'use client';

import { useState, useEffect } from 'react';
import { Shield, Mail, Heart, Trash2, CheckCircle, Clock, Eye } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  request_type: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
}

interface PrayerRequest {
  id: string;
  name: string | null;
  email: string | null;
  is_anonymous: boolean;
  prayer_request: string;
  allow_sharing: boolean;
  created_at: string;
  status: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'prayers'>('contacts');
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | PrayerRequest | null>(null);

  const ADMIN_PASSWORD = 'ShameToFlame2024!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Incorrect password');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const supabaseUrl = 'https://frmeuzfzlclipxwskaaw.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybWV1emZ6bGNsaXB4d3NrYWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTM1ODUsImV4cCI6MjA4MDYyOTU4NX0.qIhDK2vuxPv2fXVurKBTvU6efeCsTDGAbQml_fnBic4';

      console.log('Fetching from:', supabaseUrl);

      const [contactsRes, prayersRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/contact_submissions?select=*&order=created_at.desc`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }),
        fetch(`${supabaseUrl}/rest/v1/prayer_requests?select=*&order=created_at.desc`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        }),
      ]);

      console.log('Contacts response status:', contactsRes.status);
      console.log('Prayers response status:', prayersRes.status);

      const contactsData = await contactsRes.json();
      const prayersData = await prayersRes.json();

      console.log('Contacts data:', contactsData);
      console.log('Prayers data:', prayersData);

      if (Array.isArray(contactsData)) {
        setContacts(contactsData);
      } else if (contactsData.error) {
        console.error('Contacts error:', contactsData.error);
        setContacts([]);
      } else {
        setContacts([]);
      }

      if (Array.isArray(prayersData)) {
        setPrayers(prayersData);
      } else if (prayersData.error) {
        console.error('Prayers error:', prayersData.error);
        setPrayers([]);
      } else {
        setPrayers([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setContacts([]);
      setPrayers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (type: 'contact' | 'prayer', id: string, newStatus: string) => {
    try {
      const supabaseUrl = 'https://frmeuzfzlclipxwskaaw.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybWV1emZ6bGNsaXB4d3NrYWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTM1ODUsImV4cCI6MjA4MDYyOTU4NX0.qIhDK2vuxPv2fXVurKBTvU6efeCsTDGAbQml_fnBic4';
      const table = type === 'contact' ? 'contact_submissions' : 'prayer_requests';

      await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      loadData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteItem = async (type: 'contact' | 'prayer', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const supabaseUrl = 'https://frmeuzfzlclipxwskaaw.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybWV1emZ6bGNsaXB4d3NrYWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTM1ODUsImV4cCI6MjA4MDYyOTU4NX0.qIhDK2vuxPv2fXVurKBTvU6efeCsTDGAbQml_fnBic4';
      const table = type === 'contact' ? 'contact_submissions' : 'prayer_requests';

      await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      loadData();
      setSelectedItem(null);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
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
            <p className="text-center text-gray-600 mb-6">Enter password to view submissions</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage contact submissions and prayer requests</p>
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
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{contact.email}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                  {contact.request_type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(contact.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  contact.status === 'new'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {contact.status === 'new' ? <Clock className="w-3 h-3 inline mr-1" /> : <CheckCircle className="w-3 h-3 inline mr-1" />}
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
                          <th className="px-6 py-4 text-left text-sm font-semibold">Preview</th>
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
                                {prayer.is_anonymous ? 'Anonymous' : prayer.name || 'Anonymous'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {prayer.is_anonymous ? '-' : prayer.email || '-'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                {prayer.prayer_request.substring(0, 50)}...
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(prayer.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  prayer.status === 'new'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {prayer.status === 'new' ? <Clock className="w-3 h-3 inline mr-1" /> : <CheckCircle className="w-3 h-3 inline mr-1" />}
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
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Details</h3>

                  {'subject' in selectedItem ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Name</label>
                        <p className="text-gray-900">{selectedItem.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedItem.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Type</label>
                        <p className="text-gray-900">{selectedItem.request_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Subject</label>
                        <p className="text-gray-900">{selectedItem.subject}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Message</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedItem.message}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Received</label>
                        <p className="text-gray-900">{new Date(selectedItem.created_at).toLocaleString()}</p>
                      </div>

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
                          {selectedItem.is_anonymous ? 'Anonymous' : selectedItem.name || 'Anonymous'}
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
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedItem.prayer_request}</p>
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
  );
}
