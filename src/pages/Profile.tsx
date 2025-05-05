
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarIcon, User, Settings, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="flex items-center justify-center mb-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
            H
          </div>
          <h2 className="text-xl font-semibold">Hablu</h2>
          <p className="text-sm text-muted-foreground">University Student</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name">Edit Profile</Label>
              </div>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name">Goal Reminders</Label>
              </div>
              <Switch id="goal-reminders" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name">Dark Theme</Label>
              </div>
              <Switch id="dark-theme" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">App Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">
            <strong>Version:</strong> 1.0.0
          </p>
          <p className="text-sm">
            <strong>About:</strong> InspireMe helps you track and improve your personal development across academics, skills, fitness, career, and mental health.
          </p>
        </CardContent>
      </Card>
      
      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default Profile;
