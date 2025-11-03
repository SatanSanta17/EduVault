import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');

  function submit(e) {
    e.preventDefault();
    onSearch({ q: query, subject });
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 mb-6 shadow-2xl border border-white/60">
      <form onSubmit={submit} className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1 relative">
          <input
            className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-700 placeholder-gray-400 shadow-sm"
            placeholder="Search notes by title, description, or keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <svg className="absolute left-4 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="md:w-56 relative">
          <input
            className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-700 placeholder-gray-400 shadow-sm"
            placeholder="Subject (e.g., Math, Physics)"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>
        <button 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-6 md:px-8 py-2.5 font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap" 
          type="submit"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </span>
        </button>
      </form>
    </div>
  );
}







