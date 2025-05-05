
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import MissionDetail from "./pages/MissionDetail";
import BottomNav from "./components/BottomNav";
import AIAssistant from "./components/AIAssistant";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./utils/auth";

const queryClient = new QueryClient();

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Check authentication status on app load
    setAuthChecked(true);
  }, []);
  
  if (!authChecked) {
    // Show loading state until auth check is complete
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="inspireMe-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="max-w-md mx-auto bg-background min-h-screen relative">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                } />
                <Route path="/mission/:id" element={
                  <ProtectedRoute>
                    <MissionDetail />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Progress />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Only show bottom nav and AI assistant on protected routes */}
              {isAuthenticated() && (
                <>
                  <BottomNav />
                  <AIAssistant />
                </>
              )}
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
