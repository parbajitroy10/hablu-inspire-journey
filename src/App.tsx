import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
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
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/mission/:categoryId" element={<MissionDetail />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cgpa" element={<CGPATrackerPage />} />
            </Route>
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
