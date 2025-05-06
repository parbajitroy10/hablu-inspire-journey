
import React from 'react';
import EventsGenerator from '@/components/EventsGenerator';
import BottomNav from '@/components/BottomNav';

const Events: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pb-24 max-w-4xl">
      <h1 className="text-2xl font-bold mt-6 mb-2">Local Events</h1>
      <p className="text-muted-foreground mb-6">
        Discover exciting events happening around you, automatically curated based on your interests.
      </p>
      
      <EventsGenerator />
      <BottomNav />
    </div>
  );
};

export default Events;
