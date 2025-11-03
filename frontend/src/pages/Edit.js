import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [currentFilename, setCurrentFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNote() {
      setLoading(true); setError('');
      try {
        const res = await api.get(`/fetch.php?id=${id}`);
        setTitle(res.data.title || '');
        setDescription(res.data.description || '');
        setSubject(res.data.subject || '');
        setCurrentFilename(res.data.filename || '');
      } catch (e) {
        const errorMessage = e.response?.data?.error || e.message || 'Failed to load note';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    loadNote();
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setMessage(''); setError('');
    if (!title || !subject) {
      setError('Title and subject are required');
      return;
    }
    const form = new FormData();
    form.append('id', id);
    form.append('title', title);
    form.append('description', description);
    form.append('subject', subject);
    if (file) form.append('file', file);
    setLoading(true);
    try {
      // Use axios with credentials for session support
      await api.post('/update.php', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Updated successfully');
      setFile(null);
      // Optionally navigate back after short delay
      // setTimeout(() => navigate('/'), 800);
    } catch (e) {
      const errorMessage = e.response?.data?.error || e.message || 'Update failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !title) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading note...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Note</h1>
        <p className="text-gray-600">Update your study material information and content.</p>
      </div>
      
      <form onSubmit={submit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input 
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400" 
            placeholder="e.g., Introduction to Calculus - Chapter 1"
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea 
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400 resize-y min-h-[100px]" 
            rows="4" 
            placeholder="Brief description of your notes..."
            value={description} 
            onChange={e=>setDescription(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input 
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400" 
            placeholder="e.g., Mathematics, Physics, Chemistry"
            value={subject} 
            onChange={e=>setSubject(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Replace File (optional)</label>
          {currentFilename && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Current file:</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {currentFilename}
              </p>
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <input 
              type="file" 
              onChange={e=>setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload-edit"
            />
            <label htmlFor="file-upload-edit" className="cursor-pointer">
              {file ? (
                <div className="flex flex-col items-center">
                  <svg className="h-12 w-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 mb-1">Click to upload a new file</p>
                  <p className="text-xs text-gray-500">Leave empty to keep current file</p>
                </div>
              )}
            </label>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pt-4">
          <button 
            disabled={loading} 
            className="flex-1 bg-indigo-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2" 
            type="submit"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-6 py-3 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
        
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}







