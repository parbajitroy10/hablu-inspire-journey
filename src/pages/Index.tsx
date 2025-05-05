
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuoteCard from '@/components/QuoteCard';
import { getDailyQuote } from '@/utils/data';

const Index = () => {
  const navigate = useNavigate();
  const quote = getDailyQuote();
  
  useEffect(() => {
    // Check if user is returning (would eventually be part of auth flow)
    const isReturningUser = localStorage.getItem('userHasVisited');
    
    if (isReturningUser) {
      // If returning user, redirect to dashboard
      navigate('/dashboard');
    } else {
      // Mark as visited for next time
      localStorage.setItem('userHasVisited', 'true');
    }
  }, [navigate]);
  
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-1">InspireMe</h1>
      <p className="text-muted-foreground mb-6">Your daily path to improvement</p>
      
      <QuoteCard quote={quote} />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Welcome to InspireMe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your journey to self-improvement starts here. Track your progress across different aspects of your life.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
