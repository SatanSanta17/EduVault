import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, buildDownloadUrl } from '../services/api';

export default function NoteCard({ note, onDelete, onDownload, onLike, onSave }) {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = currentUser && currentUser.role === 'admin';
  const isOwner = currentUser && note.user_id === currentUser.id;
  const isLoggedIn = !!currentUser;
  const canModify = isAdmin || isOwner;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(note.likes || 0);
  const [saving, setSaving] = useState(false);
  const [liking, setLiking] = useState(false);

  // Check if note is already liked/saved
  useEffect(() => {
    if (currentUser) {
      checkLikedStatus();
      checkSavedStatus();
    }
  }, [note.id, currentUser]);

  async function checkLikedStatus() {
    try {
      const res = await api.get('/liked_notes.php');
      const likedNotes = Array.isArray(res.data) ? res.data : [];
      setIsLiked(likedNotes.some(n => n.id === note.id));
    } catch (e) {
      // Silently fail
    }
  }

  async function checkSavedStatus() {
    try {
      const res = await api.get('/saved_notes.php');
      const savedNotes = Array.isArray(res.data) ? res.data : [];
      setIsSaved(savedNotes.some(n => n.id === note.id));
    } catch (e) {
      // Silently fail
    }
  }

  async function handleLike(e) {
    e.preventDefault();
    if (liking) return;
    if (!isLoggedIn) {
      if (window.confirm('Please login to like notes. Go to login page now?')) {
        window.location.href = '/login';
      }
      return;
    }
    
    setLiking(true);
    try {
      if (isLiked) {
        await api.delete(`/liked_notes.php?note_id=${note.id}`);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await api.post('/liked_notes.php', { note_id: note.id });
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
      if (onLike) onLike();
    } catch (e) {
      console.error('Like error:', e);
      alert(e.response?.data?.error || 'Failed to like note');
    } finally {
      setLiking(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (saving) return;
    if (!isLoggedIn) {
      if (window.confirm('Please login to save notes. Go to login page now?')) {
        window.location.href = '/login';
      }
      return;
    }
    
    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/saved_notes.php?note_id=${note.id}`);
        setIsSaved(false);
      } else {
        await api.post('/saved_notes.php', { note_id: note.id });
        setIsSaved(true);
      }
      if (onSave) onSave();
    } catch (e) {
      console.error('Save error:', e);
      alert(e.response?.data?.error || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  }

  const handleDownload = async (e) => {
    e.preventDefault();
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = buildDownloadUrl(note.id);
    link.target = '_blank';
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Refresh notes list after download completes (give server time to update count)
    setTimeout(() => {
      if (onDownload) onDownload();
    }, 1000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/60 flex flex-col h-full group">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">{note.title}</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            {note.subject}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(note.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {note.uploader_name && (
          <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">{note.uploader_name}</span>
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{note.description || 'No description provided.'}</p>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{note.downloads || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likesCount}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <a
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
            href={buildDownloadUrl(note.id)}
            onClick={handleDownload}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
          
          {!isOwner && (
            <>
              <button
                onClick={handleLike}
                disabled={liking}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  isLiked
                    ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${liking ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                {liking ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  isSaved
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isSaved ? 'Unsave' : 'Save'}
              >
                {saving ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </>
          )}
        </div>
        
        {canModify && (
          <div className="flex gap-2">
            <Link
              to={`/edit/${note.id}`}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors flex items-center justify-center gap-1"
              title="Edit"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors flex items-center justify-center gap-1"
              onClick={() => onDelete(note.id)}
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}






