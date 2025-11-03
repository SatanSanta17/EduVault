import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 h-72 w-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 h-96 w-96 bg-black/10 rounded-full blur-3xl"></div>
      </div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo and Title */}
          <div className="flex justify-center items-center gap-5 mb-10">
            <div className="h-20 w-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
              <span className="text-white font-bold text-3xl">EV</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.25)] tracking-tight">
              EduVault
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white drop-shadow mb-4">
            Share, Discover, and Organize Study Notes
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with students worldwide. Upload, browse, and download study materials across all subjects. 
            Your knowledge hub for academic excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-indigo-700 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 text-white border-2 border-white/80 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 group hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Notes</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore thousands of study materials organized by subject and topic. Find exactly what you need for your courses.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 group hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your notes and help fellow students learn and succeed. Build a community of learners.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 group hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find exactly what you need with advanced search and filtering. Quick access to relevant study materials.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/60">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
                <div className="text-gray-600 font-medium">Study Notes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600 font-medium">Subjects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

