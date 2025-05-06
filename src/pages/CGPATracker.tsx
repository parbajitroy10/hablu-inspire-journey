
import React from 'react';
import CGPATracker from '@/components/CGPATracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Award, TrendingUp } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const CGPATrackerPage: React.FC = () => {
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-2">CGPA Tracker</h1>
      <p className="text-muted-foreground mb-6">Track and improve your academic performance</p>
      
      <div className="mb-6">
        <CGPATracker />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default CGPATrackerPage;
