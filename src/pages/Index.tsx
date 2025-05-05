
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuoteCard from '@/components/QuoteCard';
import { getDailyQuote } from '@/utils/data';

const Index = () => {
  const quote = getDailyQuote();
  
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
          <p className="text-muted-foreground">
            Use the navigation bar at the bottom to explore different sections of the app.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
