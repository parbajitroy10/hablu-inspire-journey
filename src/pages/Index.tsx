
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuoteCard from '@/components/QuoteCard';
import { getDailyQuote } from '@/utils/data';
import { isAuthenticated } from '@/utils/auth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const quote = getDailyQuote();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="p-6 pb-24 min-h-screen flex flex-col">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-1">InspireMe</h1>
        <p className="text-muted-foreground mb-6">Your daily path to improvement</p>
        
        <QuoteCard quote={quote} />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome to InspireMe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your journey to self-improvement starts here. Track your progress across different aspects of your life.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="text-center text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} InspireMe. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
