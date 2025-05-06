
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, User as UserIcon, Settings, LogOut, Moon, Sun, Bell, Shield, Info } from 'lucide-react';
import EditProfileModal from '@/components/EditProfileModal';
import { useTheme } from '@/components/ThemeProvider';
import { getCurrentUser, setCurrentUser, logoutUser } from '@/utils/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Progress } from '@/components/ui/progress';

const Profile: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  
  const isDarkMode = theme === 'dark';
  
  const handleToggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    toast.success(`${isDarkMode ? 'Light' : 'Dark'} theme activated!`);
  };
  
  const handleUpdateProfile = (updatedUser: typeof user) => {
    if (!updatedUser) return;
    setCurrentUser(updatedUser);
    toast.success("Profile updated successfully!");
  };
  
  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully!");
    navigate('/auth');
  };
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  if (!user) {
    return <div className="p-6 flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="flex items-center justify-center mb-8">
        <div className="flex flex-col items-center animate-fade-in">
          <Avatar className="w-24 h-24 mb-3 ring-4 ring-primary/30 hover:ring-primary transition-all duration-300">
            {user.photoUrl ? (
              <AvatarImage src={user.photoUrl} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-3xl font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">{user.university || 'University Student'}</p>
          
          <div className="mt-4 flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="hover-scale"
              onClick={() => setIsEditProfileModalOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        <Button 
          variant={activeTab === 'settings' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveTab('settings')}
          className="flex-shrink-0"
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
        <Button 
          variant={activeTab === 'stats' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveTab('stats')}
          className="flex-shrink-0"
        >
          <BarChart className="h-4 w-4 mr-1" />
          Stats
        </Button>
        <Button 
          variant={activeTab === 'info' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveTab('info')}
          className="flex-shrink-0"
        >
          <Info className="h-4 w-4 mr-1" />
          App Info
        </Button>
      </div>
      
      {activeTab === 'settings' && (
        <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between hover:bg-accent/10 p-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-primary" />
                  <Label htmlFor="name">Edit Profile</Label>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between hover:bg-accent/10 p-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-primary" />
                  <Label htmlFor="name">Goal Reminders</Label>
                </div>
                <Switch id="goal-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between hover:bg-accent/10 p-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="h-4 w-4 text-primary" />
                  ) : (
                    <Sun className="h-4 w-4 text-primary" />
                  )}
                  <Label htmlFor="dark-theme">Dark Theme</Label>
                </div>
                <Switch 
                  id="dark-theme" 
                  checked={isDarkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between hover:bg-accent/10 p-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <Label htmlFor="name">Data Privacy</Label>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'stats' && (
        <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-4 w-4 text-primary" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{user.overallProgress || 0}%</span>
                </div>
                <Progress value={user.overallProgress || 0} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <h3 className="text-3xl font-bold">{user.level || 1}</h3>
                  <p className="text-xs text-muted-foreground">Current Level</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <h3 className="text-3xl font-bold">{user.points || 0}</h3>
                  <p className="text-xs text-muted-foreground">Achievement Points</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <h3 className="text-3xl font-bold">{user.streak || 0}</h3>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <h3 className="text-3xl font-bold">{
                    user.joinDate ? 
                    Math.floor((new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)) :
                    0
                  }</h3>
                  <p className="text-xs text-muted-foreground">Days Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'info' && (
        <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Version</h3>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">About</h3>
                <p className="text-sm text-muted-foreground">
                  InspireMe helps you track and improve your personal development across academics, skills, fitness, career, and mental health.
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => window.open('https://example.com/privacy', '_blank')}
                >
                  Privacy Policy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => window.open('https://example.com/terms', '_blank')}
                >
                  Terms of Service
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
      
      <EditProfileModal 
        open={isEditProfileModalOpen}
        onOpenChange={setIsEditProfileModalOpen}
        user={user}
        onSave={handleUpdateProfile}
      />
      
      <BottomNav />
    </div>
  );
};

export default Profile;
