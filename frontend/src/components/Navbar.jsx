import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  async function handleLogout() {
    try {
      await api.post('/logout.php');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('user');
      navigate('/');
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group">
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow border border-white/30">
              <span className="text-white font-bold text-lg">EV</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow">EduVault</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink 
              to="/home" 
              end 
              className={({isActive}) => 
                `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-white/20 border border-white/30' 
                    : 'text-white/90 hover:text-white bg-transparent hover:bg-white/10 border border-transparent'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/upload" 
              className={({isActive}) => 
                `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-white/20 border border-white/30' 
                    : 'text-white/90 hover:text-white bg-transparent hover:bg-white/10 border border-transparent'
                }`
              }
            >
              Upload
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => 
                `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-white/20 border border-white/30' 
                    : 'text-white/90 hover:text-white bg-transparent hover:bg-white/10 border border-transparent'
                }`
              }
            >
              Dashboard
            </NavLink>
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold text-sm border border-white/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/80">Welcome back,</span>
                    <span className="text-sm font-semibold text-white drop-shadow-sm">{user.name}</span>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <span className="px-2.5 py-1 text-xs bg-white/20 text-white rounded-full font-semibold border border-white/30">
                    Admin
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/15 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-2 border border-white/30"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}






