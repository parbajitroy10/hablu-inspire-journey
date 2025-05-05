
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarIcon, User as UserIcon, Settings, LogOut, Moon, Sun } from 'lucide-react';
import EditProfileModal from '@/components/EditProfileModal';
import { useTheme } from '@/components/ThemeProvider';
import { getCurrentUser, setCurrentUser, logoutUser } from '@/utils/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  
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
  
  if (!user) {
    return <div className="p-6">Loading...</div>;
  }
  
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="flex items-center justify-center mb-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.university || 'University Student'}</p>
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
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name">Edit Profile</Label>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Edit
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name">Goal Reminders</Label>
              </div>
              <Switch id="goal-reminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="dark-theme">Dark Theme</Label>
              </div>
              <Switch 
                id="dark-theme" 
                checked={isDarkMode}
                onCheckedChange={handleToggleDarkMode}
              />
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
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
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
    </div>
  );
};

export default Profile;
