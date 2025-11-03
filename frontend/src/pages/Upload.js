import React, { useState } from 'react';
import { api, API_BASE } from '../services/api';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMessage(''); setError('');
    if (!title || !subject || !file) {
      setError('Title, subject, and file are required');
      return;
    }
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('subject', subject);
    form.append('file', file);
    setLoading(true);
    try {
      // Use axios with credentials for session support
      const res = await api.post('/upload.php', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Uploaded successfully');
      setTitle(''); setDescription(''); setSubject(''); setFile(null);
    } catch (e) {
      const errorMessage = e.response?.data?.error || e.message || 'Upload failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-80 w-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-black/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">Upload Your Notes</h1>
          <p className="text-white/90">Share your study materials with the community and help fellow students learn.</p>
        </div>
        
        <form onSubmit={submit} className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-6 md:p-8 space-y-5">
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors bg-white/70">
              <input 
                type="file" 
                onChange={e=>setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
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
                    <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX (MAX. 10MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-2">
            <button 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-6 py-3 font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2" 
              type="submit"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Notes
                </>
              )}
            </button>
          </div>
          
          {message && (
            <div className="bg-green-50/90 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}







