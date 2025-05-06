
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getCategories, 
  getDailyQuote, 
  getGoals, 
  getPendingGoals, 
  calculateOverallProgress,
  getGoalStats,
  generateMotivationMessage,
  updateGoals
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
  Target,
  GraduationCap,
  LayoutDashboard,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { generateCourseRecommendations } from '@/utils/cgpaUtils';

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
      <div className="p-6 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="flex justify-between items-center mb-4">
          <Logo size="md" />
          <div 
            className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
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
        
        <h1 className="text-2xl font-bold mb-1 animate-fade-in">Welcome, {getCurrentUser()?.name || 'User'}</h1>
        <p className="text-muted-foreground animate-fade-in">Let's work on your missions today</p>
        
        {!currentMood && (
          <Card className="mt-4 mb-6 border-none bg-white/50 backdrop-blur-sm shadow-md dark:bg-black/40 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors" 
                  onClick={() => handleMoodSelect('happy')}
                >
                  <Smile className="h-8 w-8 text-green-500 mb-1" />
                  <span className="text-xs">Happy</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
                  onClick={() => handleMoodSelect('neutral')}
                >
                  <Meh className="h-8 w-8 text-amber-500 mb-1" />
                  <span className="text-xs">Neutral</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/5 to-background animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2 text-primary" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{overallProgress}%</p>
                  <p className="text-sm text-muted-foreground">of your missions completed</p>
                </div>
                <ProgressRing progress={overallProgress} size={80} strokeWidth={6} className="text-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 shadow transition-transform hover:scale-[1.02] duration-300">
                  <CardContent className="p-4 flex flex-col items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                    <span className="text-xl font-bold">{goalStats.completed}</span>
                    <span className="text-xs text-muted-foreground">Completed</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 shadow transition-transform hover:scale-[1.02] duration-300">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Flag className="h-6 w-6 text-amber-500 mb-2" />
                    <span className="text-xl font-bold">{goalStats.pending}</span>
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md overflow-hidden animate-fade-in bg-gradient-to-br from-purple-500/5 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                Academic Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Current CGPA</p>
                  <Link 
                    to="/cgpa" 
                    className="text-primary text-sm hover:underline flex items-center"
                  >
                    View details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="bg-muted h-10 rounded-md flex items-center px-4">
                  <p className="font-mono font-bold">
                    {(() => {
                      const cgpaData = (() => {
                        const stored = localStorage.getItem('inspire-cgpa');
                        return stored ? JSON.parse(stored) : null;
                      })();
                      
                      return cgpaData?.currentCGPA || '—';
                    })()}
                  </p>
                  <div className="h-4 w-[1px] bg-border mx-3"></div>
                  <p className="text-sm text-muted-foreground">Target: {(() => {
                      const cgpaData = (() => {
                        const stored = localStorage.getItem('inspire-cgpa');
                        return stored ? JSON.parse(stored) : null;
                      })();
                      
                      return cgpaData?.targetCGPA || '—';
                    })()}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/cgpa')}
                className="w-full gap-2"
                variant="outline"
              >
                <GraduationCap className="h-4 w-4" />
                Manage CGPA Tracker
              </Button>
              
              <div className="p-3 rounded-md bg-primary/5 border border-primary/10 hidden lg:block">
                <p className="text-sm">
                  {(() => {
                    const cgpaData = (() => {
                      const stored = localStorage.getItem('inspire-cgpa');
                      return stored ? JSON.parse(stored) : null;
                    })();
                    
                    const recommendations = generateCourseRecommendations(
                      cgpaData?.currentCGPA || 0, 
                      cgpaData?.targetCGPA || 3.5
                    );
                    
                    return recommendations[0] || "Add courses to get personalized recommendations";
                  })()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-lg font-semibold mb-3 flex items-center animate-fade-in">
          <Star className="h-5 w-5 mr-2 text-primary" />
          Your Missions
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
          
          <Button 
            variant="outline" 
            className="h-32 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-background/80 hover:border-primary/30 transition-all duration-300"
            onClick={() => navigate('/goals')}
          >
            <Plus size={24} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Mission</span>
          </Button>
        </div>
        
        <h2 className="text-lg font-semibold mb-3 flex items-center animate-fade-in">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Focus Today
          {goalStats.dueToday > 0 && (
            <Badge variant="destructive" className="ml-2">
              {goalStats.dueToday} due today
            </Badge>
          )}
        </h2>
        
        <Card className="mb-6 border-none shadow-md animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Today's Tasks
              </span>
              <ChevronRight 
                className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" 
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
              <div className="text-center py-8 flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-muted-foreground">
                  All caught up! Add some new goals to stay on track
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate('/goals')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Goal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-6 border-none shadow-md bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 animate-fade-in">
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
              className="w-full text-primary hover:bg-primary/10"
              onClick={() => {
                // Generate new motivation message
                const newMessage = generateMotivationMessage();
                setMotivationMessage(newMessage);
                toast.success("New insight generated");
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
