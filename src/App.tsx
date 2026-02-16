import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Villa, User, LocationType } from './types';
import { StorageService } from './services/storageService';
import { ApiService } from './services/apiService';
import { HomePage } from './pages/HomePage';
import { VillaDetailsPage } from './pages/VillaDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyBookingsPage } from './pages/MyBookingsPage';

function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Data State
  const [villas, setVillas] = useState<Villa[]>([]);
  const [filterLocation, setFilterLocation] = useState<LocationType | 'All'>('All');

  // Initialize Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize Data
  useEffect(() => {
    async function load() {
      try {
        const data = await ApiService.getVillas();
        setVillas(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const storedUser = StorageService.getUser(currentUser.id);
      if (storedUser) {
        setCurrentUser(storedUser);
      } else {
        StorageService.saveUser(currentUser);
      }
    }
  }, [currentUser?.id]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomePage
            villas={villas}
            filterLocation={filterLocation}
            setFilterLocation={setFilterLocation}
            currentUser={currentUser}
            theme={theme}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
          />
        } />
        <Route path="/villas/:id" element={
          <VillaDetailsPage
            villas={villas}
            currentUser={currentUser}
            theme={theme}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
          />
        } />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/admin" element={
          currentUser?.role === 'admin' ? (
            <AdminDashboardPage
              villas={villas}
              setVillas={setVillas}
              currentUser={currentUser}
              theme={theme}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
            />
          ) : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          currentUser ? (
            <ProfilePage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              theme={theme}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
            />
          ) : <Navigate to="/login" />
        } />
        <Route path="/bookings" element={
          currentUser ? (
            <MyBookingsPage
              currentUser={currentUser}
              theme={theme}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
            />
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;