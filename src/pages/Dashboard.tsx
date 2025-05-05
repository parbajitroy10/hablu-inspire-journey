
import React, { useState, useEffect } from 'react';
import { 
  getCategories, 
  getDailyQuote, 
  getGoals, 
  getPendingGoals, 
  calculateOverallProgress 
} from '@/utils/data';
import { ImprovementCategory, Goal, DailyQuote } from '@/types';
import QuoteCard from '@/components/QuoteCard';
import CategoryCard from '@/components/CategoryCard';
import GoalItem from '@/components/GoalItem';
import ProgressRing from '@/components/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  User, 
  Calendar, 
  CheckCircle, 
  Smile, 
  Meh, 
  Frown,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<ImprovementCategory[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [quote, setQuote] = useState<DailyQuote>({ text: '', author: '' });
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load data on component mount
    const loadedCategories = getCategories();
    const loadedGoals = getGoals();
    const dailyQuote = getDailyQuote();
    
    setCategories(loadedCategories);
    setGoals(loadedGoals);
    setQuote(dailyQuote);
    setOverallProgress(calculateOverallProgress(loadedCategories));

    // Check if user has set a mood today from localStorage
    const storedMood = localStorage.getItem('todayMood');
    if (storedMood) {
      setCurrentMood(storedMood);
    }
  }, []);
  
  const pendingGoals = getPendingGoals(goals, 7).slice(0, 3);

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    localStorage.setItem('todayMood', mood);
    toast.success(`Mood updated to ${mood}!`);
  };
  
  const handleToggleGoal = (id: string, completed: boolean) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, completed } : goal
    );
    
    setGoals(updatedGoals);
    toast(completed ? "Goal completed! 🎉" : "Goal marked as pending");
  };
  
  return (
    <div className="pb-24">
      <div className="p-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome, Hablu</h1>
            <p className="text-muted-foreground">Let's work on your missions today</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
        </div>
        
        {!currentMood && (
          <Card className="mb-6 animate-fade-in">
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Overall Progress</h2>
            <p className="text-sm text-muted-foreground">
              You are {overallProgress}% on track!
            </p>
          </div>
          <ProgressRing progress={overallProgress} size={60} />
        </div>
        
        <h2 className="text-lg font-semibold mb-3">Your Missions</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              onClick={() => navigate(`/category/${category.id}`)}
            />
          ))}
        </div>
        
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          Focus Today
          <Calendar className="ml-2 h-4 w-4 text-muted-foreground" />
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
                <p className="text-sm">
                  Based on your progress, focusing on your <span className="font-semibold text-primary">Academics</span> mission 
                  would be most beneficial this week. You're making excellent progress in Fitness!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <QuoteCard quote={quote} />
      </div>
    </div>
  );
};

export default Dashboard;
