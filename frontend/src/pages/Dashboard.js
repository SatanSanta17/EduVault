import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import NoteCard from '../components/NoteCard';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [myNotes, setMyNotes] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [likedNotes, setLikedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shared');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', institution: '', bio: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [profileRes, myNotesRes, savedRes, likedRes] = await Promise.all([
        api.get('/profile.php'),
        api.get('/my_notes.php'),
        api.get('/saved_notes.php'),
        api.get('/liked_notes.php')
      ]);

      setProfile(profileRes.data.user);
      setStats(profileRes.data.stats);
      setMyNotes(Array.isArray(myNotesRes.data) ? myNotesRes.data : []);
      setSavedNotes(Array.isArray(savedRes.data) ? savedRes.data : []);
      setLikedNotes(Array.isArray(likedRes.data) ? likedRes.data : []);
      
      setEditForm({
        name: profileRes.data.user.name || '',
        institution: profileRes.data.user.institution || '',
        bio: profileRes.data.user.bio || ''
      });
    } catch (e) {
      console.error('Error loading dashboard:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Use POST instead of PUT for broader Apache/PHP compatibility
      const res = await api.post('/profile.php', editForm);
      setProfile(res.data.user);
      setShowEditModal(false);
      // Update localStorage if needed
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.data.user }));
    } catch (e) {
      alert('Failed to update profile: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/delete.php?id=${id}`);
      setMyNotes(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      alert('Failed to delete');
    }
  }

  async function handleDownload() {
    await loadDashboard();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-80 w-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-black/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="space-y-8 pb-8">
        {/* Profile Section */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.name || 'User'}</h1>
              <p className="text-gray-600 mb-3">{profile?.email}</p>
              {profile?.institution && (
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">{profile.institution}</span>
                </div>
              )}
              {profile?.bio && (
                <p className="text-gray-600 italic">"{profile.bio}"</p>
              )}
            </div>
            
            <button
              onClick={() => setShowEditModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-white/60">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{stats?.notes_shared || 0}</div>
              <div className="text-sm text-gray-700">Shared Notes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats?.total_downloads || 0}</div>
              <div className="text-sm text-gray-700">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats?.total_likes_received || 0}</div>
              <div className="text-sm text-gray-700">Likes Received</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats?.notes_saved || 0}</div>
              <div className="text-sm text-gray-700">Saved Notes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-1">{stats?.notes_liked || 0}</div>
              <div className="text-sm text-gray-700">Liked Notes</div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
          <div className="border-b border-white/60">
            <div className="flex">
              <button
                onClick={() => setActiveTab('shared')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'shared'
                    ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                My Shared Notes ({myNotes.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'saved'
                    ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Notes I Saved ({savedNotes.length})
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'liked'
                    ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Liked Notes ({likedNotes.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'shared' && (
              <div>
                {myNotes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myNotes.map(note => (
                      <div key={note.id} className="relative">
                        <NoteCard note={note} onDelete={handleDelete} onDownload={handleDownload} />
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                              <div className="font-bold text-indigo-600">{note.downloads || 0}</div>
                              <div className="text-gray-600">Downloads</div>
                            </div>
                            <div>
                              <div className="font-bold text-pink-600">{note.like_count || 0}</div>
                              <div className="text-gray-600">Likes</div>
                            </div>
                            <div>
                              <div className="font-bold text-green-600">{note.save_count || 0}</div>
                              <div className="text-gray-600">Saved</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes shared yet</h3>
                    <p className="text-gray-600 mb-6">Start sharing your study materials!</p>
                    <Link to="/upload" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                      Upload Your First Note
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                {savedNotes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedNotes.map(note => (
                      <NoteCard key={note.id} note={note} onDelete={() => {}} onDownload={handleDownload} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved notes</h3>
                    <p className="text-gray-600">Save notes from the home page to access them later</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'liked' && (
              <div>
                {likedNotes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedNotes.map(note => (
                      <NoteCard key={note.id} note={note} onDelete={() => {}} onDownload={handleDownload} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No liked notes</h3>
                    <p className="text-gray-600">Like notes from the home page to see them here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={editForm.institution}
                    onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                    placeholder="e.g., IIT Delhi, Harvard University"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Bio / Tagline
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="e.g., Computer Science Student @ IIT Delhi"
                    rows="3"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 resize-y"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-indigo-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

