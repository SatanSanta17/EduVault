import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Edit from './pages/Edit';
import Dashboard from './pages/Dashboard';

export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Update user state whenever route changes (login/register/logout)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      const newUser = stored ? JSON.parse(stored) : null;
      setUser(newUser);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);
  
  const isPublicFullBleed = !user && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register');
  
  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className={isPublicFullBleed ? "flex-1 p-0" : "flex-1 container mx-auto px-4 py-6"}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" replace /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
        </Routes>
      </main>
      {user && (
        <footer className="border-t bg-white">
          <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
            © {new Date().getFullYear()} EduVault
          </div>
        </footer>
      )}
    </div>
  );
}






