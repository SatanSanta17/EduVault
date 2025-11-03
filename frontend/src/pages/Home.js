import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import NoteCard from '../components/NoteCard';
import { api, API_BASE } from '../services/api';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchNotes(params = {}) {
    setLoading(true); setError('');
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await api.get(`/fetch.php${qs ? `?${qs}` : ''}`);
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Error fetching notes:', e);
      const errorMessage = e.response?.data?.error || e.response?.data?.details || e.message || 'Failed to fetch notes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPopular() {
    try {
      const res = await api.get('/popular.php?limit=5');
      setPopular(Array.isArray(res.data) ? res.data : []);
    } catch (e) { /* ignore */ }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/delete.php?id=${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
      setPopular(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      alert('Failed to delete');
    }
  }

  async function handleDownload() {
    // Refresh both notes and popular after download to update counts
    await fetchNotes();
    await fetchPopular();
  }

  useEffect(() => {
    fetchNotes();
    fetchPopular();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-96 w-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 h-80 w-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/3 h-96 w-96 bg-black/10 rounded-full blur-3xl"></div>
        </div>
      </div>
      <div className="relative space-y-10 pb-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">Discover Study Notes</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Access thousands of study materials shared by students worldwide. Find the perfect notes for your subjects.
          </p>
        </div>

        <SearchBar onSearch={fetchNotes} />

        {/* Main Notes Section */}
        <section>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/60 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Notes</h2>
              {notes.length > 0 && (
                <span className="text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full font-medium shadow-sm">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'} found
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/60">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <p className="text-gray-700 font-medium">Loading notes...</p>
              </div>
            </div>
          ) : notes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map(n => (
                <NoteCard key={n.id} note={n} onDelete={handleDelete} onDownload={handleDownload} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/60 shadow-xl">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or upload your first note!</p>
            </div>
          )}
      </section>

        {/* Popular Notes Section */}
        {popular.length > 0 && (
          <section className="mt-12">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/60 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Popular Notes</h2>
                  <p className="text-sm text-gray-600 mt-1">Most downloaded study materials</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular.map(n => (
                <NoteCard key={`p-${n.id}`} note={n} onDelete={handleDelete} onDownload={handleDownload} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
