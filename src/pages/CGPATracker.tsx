
import React from 'react';
import CGPATracker from '@/components/CGPATracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Award, TrendingUp } from 'lucide-react';

const CGPATrackerPage: React.FC = () => {
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-2">CGPA Tracker</h1>
      <p className="text-muted-foreground mb-6">Track and improve your academic performance</p>
      
      <div className="mb-6">
        <CGPATracker />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            CGPA Improvement Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Attend All Classes
            </h3>
            <p className="text-sm text-muted-foreground">
              Regular attendance ensures you don't miss important material and demonstrates commitment to professors.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Create a Study Schedule
            </h3>
            <p className="text-sm text-muted-foreground">
              Allocate specific time blocks for each subject to ensure consistent study habits.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Form Study Groups
            </h3>
            <p className="text-sm text-muted-foreground">
              Collaborating with peers can provide new perspectives and strengthen your understanding.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Seek Academic Support
            </h3>
            <p className="text-sm text-muted-foreground">
              Take advantage of professor office hours and university tutoring services when needed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CGPATrackerPage;
