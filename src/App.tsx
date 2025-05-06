
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import Progress from '@/pages/Progress';
import MissionDetail from '@/pages/MissionDetail';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import AIAssistant from '@/components/AIAssistant';
import { Toaster } from 'sonner';
import { getCurrentUser } from '@/utils/auth';
import CGPATrackerPage from "./pages/CGPATracker";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }

    return <>{children}</>;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="inspire-theme">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/goals" element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            } />
            <Route path="/mission/:categoryId" element={
              <ProtectedRoute>
                <MissionDetail />
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/cgpa" element={
              <ProtectedRoute>
                <CGPATrackerPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIAssistant />
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
