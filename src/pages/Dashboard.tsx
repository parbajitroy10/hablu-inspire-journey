
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getCategories, 
  getDailyQuote, 
  getGoals, 
  getPendingGoals, 
  calculateOverallProgress,
  getGoalStats,
  generateMotivationMessage
} from '@/utils/data';
import { ImprovementCategory, Goal, DailyQuote } from '@/types';
import { getCurrentUser, setCurrentUser } from '@/utils/auth';
import QuoteCard from '@/components/QuoteCard';
import CategoryCard from '@/components/CategoryCard';
import GoalItem from '@/components/GoalItem';
import ProgressRing from '@/components/ProgressRing';
import Logo from '@/components/Logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  ChevronRight, 
  User, 
  Calendar, 
  CheckCircle, 
  Smile, 
  Meh, 
  Frown,
  TrendingUp,
  Plus,
  BarChart2,
  Flag,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<ImprovementCategory[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [quote, setQuote] = useState<DailyQuote>({ text: '', author: '' });
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [goalStats, setGoalStats] = useState({ total: 0, completed: 0, pending: 0, dueToday: 0 });
  const [motivationMessage, setMotivationMessage] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load data on component mount
    const loadedCategories = getCategories();
    const loadedGoals = getGoals();
    const dailyQuote = getDailyQuote();
    const stats = getGoalStats();
    const motivation = generateMotivationMessage();
    
    setCategories(loadedCategories);
    setGoals(loadedGoals);
    setQuote(dailyQuote);
    setOverallProgress(calculateOverallProgress(loadedCategories));
    setGoalStats(stats);
    setMotivationMessage(motivation);

    // Check if user has set a mood today from currentUser
    const user = getCurrentUser();
    if (user?.currentMood) {
      setCurrentMood(user.currentMood);
    }
  }, []);
  
  const pendingGoals = getPendingGoals(goals, 7).slice(0, 3);

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    
    // Update user mood in local storage
    const user = getCurrentUser();
    if (user) {
      const updatedUser = {
        ...user,
        currentMood: mood as 'happy' | 'neutral' | 'sad' | 'excited' | 'tired',
        lastCheckIn: new Date()
      };
      setCurrentUser(updatedUser);
    }
    
    toast.success(`Mood updated to ${mood}!`);
  };
  
  const handleToggleGoal = (id: string, completed: boolean) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, completed } : goal
    );
    
    setGoals(updatedGoals);
    updateGoals(updatedGoals);
    toast(completed ? "Goal completed! 🎉" : "Goal marked as pending");
    
    // Refresh goal stats
    setGoalStats(getGoalStats());
  };
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/mission/${categoryId}`);
  };
  
  return (
    <div className="pb-24">
      <div className="p-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="flex justify-between items-center mb-4">
          <Logo size="md" />
          <div 
            className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            {getCurrentUser()?.photoUrl ? (
              <img 
                src={getCurrentUser()?.photoUrl} 
                alt={getCurrentUser()?.name || 'User'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-1">Welcome, {getCurrentUser()?.name || 'User'}</h1>
        <p className="text-muted-foreground">Let's work on your missions today</p>
        
        {!currentMood && (
          <Card className="mt-4 mb-6 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center" 
                  onClick={() => handleMoodSelect('happy')}
                >
                  <Smile className="h-8 w-8 text-green-500 mb-1" />
                  <span className="text-xs">Happy</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center"
                  onClick={() => handleMoodSelect('neutral')}
                >
                  <Meh className="h-8 w-8 text-amber-500 mb-1" />
                  <span className="text-xs">Neutral</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center"
                  onClick={() => handleMoodSelect('sad')}
                >
                  <Frown className="h-8 w-8 text-blue-500 mb-1" />
                  <span className="text-xs">Sad</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="px-6 py-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Overall Progress</h2>
            <ProgressRing progress={overallProgress} size={70} />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            You are {overallProgress}% on track!
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
              <CardContent className="p-4 flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-1" />
                <span className="text-xl font-bold">{goalStats.completed}</span>
                <span className="text-xs text-muted-foreground">Completed</span>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800">
              <CardContent className="p-4 flex flex-col items-center">
                <Flag className="h-8 w-8 text-amber-500 mb-1" />
                <span className="text-xl font-bold">{goalStats.pending}</span>
                <span className="text-xs text-muted-foreground">Pending</span>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-3">Your Missions</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
          
          <Button 
            variant="outline" 
            className="h-32 border-dashed flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/goals')}
          >
            <Plus size={24} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Mission</span>
          </Button>
        </div>
        
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          Focus Today
          <Calendar className="ml-2 h-4 w-4 text-muted-foreground" />
          {goalStats.dueToday > 0 && (
            <Badge variant="destructive" className="ml-2">
              {goalStats.dueToday} due today
            </Badge>
          )}
        </h2>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Today's Tasks</span>
              <ChevronRight 
                className="h-5 w-5 text-muted-foreground cursor-pointer" 
                onClick={() => navigate('/goals')}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingGoals.length > 0 ? (
              pendingGoals.map(goal => (
                <GoalItem 
                  key={goal.id} 
                  goal={goal} 
                  onToggle={handleToggleGoal} 
                />
              ))
            ) : (
              <div className="text-center py-4 flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-muted-foreground">
                  All caught up! Add some new goals to stay on track
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/goals')}
                >
                  Add New Goal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Insight</CardTitle>
            <CardDescription>AI-powered recommendation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm">{motivationMessage}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-primary"
              onClick={() => {
                // Generate new motivation message
                const newMessage = generateMotivationMessage();
                setMotivationMessage(newMessage);
              }}
            >
              Get new insight
            </Button>
          </CardFooter>
        </Card>
        
        <QuoteCard quote={quote} />
      </div>
    </div>
  );
};

export default Dashboard;
