import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      try {
          // Use admin login endpoint if admin mode is selected
          const endpoint = isAdminLogin ? '/admin_login.php' : '/login.php';
          const res = await api.post(endpoint, {
              email,
              password
          });
  
          if (res.data.success) {
              localStorage.setItem('user', JSON.stringify(res.data.user));
              navigate('/home');
          } else {
              setError(res.data.error || 'Login failed');
          }
      } catch (e) {
          console.error('Login error:', e);
          const status = e.response?.status;
          const serverMsg = e.response?.data?.error;
          if (status === 404 && serverMsg && serverMsg.toLowerCase().includes('email')) {
            setError('Email not found. Please register.');
          } else if (status === 401) {
            setError('Incorrect password. Please try again.');
          } else {
            setError(serverMsg || 'Login failed. Please try again.');
          }
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-24 h-80 w-80 bg-black/10 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <img src="/logo.svg" alt="EduVault Logo" className="h-12 w-12 drop-shadow" />
            <span className="text-3xl font-extrabold text-white drop-shadow-md tracking-tight">EduVault</span>
          </Link>
          <h2 className="text-2xl font-semibold text-white">Sign In</h2>
          <p className="text-white/90 mt-2">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/60">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Admin/User Toggle */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setIsAdminLogin(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isAdminLogin
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                User Login
              </button>
              <button
                type="button"
                onClick={() => setIsAdminLogin(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAdminLogin
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin Login
              </button>
            </div>

            {isAdminLogin && (
              <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded text-sm">
                <strong>Admin Mode:</strong> Enter your administrator credentials
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={isAdminLogin ? "admin@eduvault.com" : "your@email.com"}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10.585 10.585A2 2 0 0012 14a2 2 0 001.414-.586M9.88 4.64A9.993 9.993 0 0121 12c-1.2 2.09-3.07 3.86-5.3 4.95m-2.74 1.01A10.08 10.08 0 019 19.36C6.02 18.16 3.78 15.86 3 12a10.083 10.083 0 014.22-5.421" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isAdminLogin
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {loading ? (isAdminLogin ? 'Signing In as Admin...' : 'Signing In...') : (isAdminLogin ? 'Sign In as Admin' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign up here
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

