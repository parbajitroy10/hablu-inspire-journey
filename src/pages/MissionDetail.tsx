
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategories, getGoals, updateGoals } from '@/utils/data';
import { ImprovementCategory, Goal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, CheckCircle, Award, Flag, BarChart2 } from 'lucide-react';
import GoalItem from '@/components/GoalItem';
import ProgressRing from '@/components/ProgressRing';
import AddGoalModal from '@/components/AddGoalModal';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ImprovementCategory | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    pendingGoals: 0,
    urgentGoals: 0
  });
  
  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }
    
    loadMissionData();
  }, [id, navigate]);
  
  const loadMissionData = () => {
    const categories = getCategories();
    const foundCategory = categories.find(c => c.id === id);
    
    if (!foundCategory) {
      navigate('/dashboard');
      return;
    }
    
    setCategory(foundCategory);
    
    const allGoals = getGoals();
    const categoryGoals = allGoals.filter(goal => goal.categoryId === id);
    setGoals(categoryGoals);
    
    // Calculate stats
    const completed = categoryGoals.filter(g => g.completed).length;
    const pending = categoryGoals.length - completed;
    const urgent = categoryGoals.filter(g => {
      if (g.completed) return false;
      if (!g.dueDate) return false;
      
      const dueDate = new Date(g.dueDate);
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      return dueDate <= threeDaysFromNow;
    }).length;
    
    setStats({
      totalGoals: categoryGoals.length,
      completedGoals: completed,
      pendingGoals: pending,
      urgentGoals: urgent
    });
  };
  
  const handleToggleGoal = (id: string, completed: boolean) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, completed } : goal
    );
    
    setGoals(updatedGoals);
    
    // Update all goals in storage - this will also update the category progress
    const allGoals = getGoals();
    const updatedAllGoals = allGoals.map(goal => {
      if (goal.id === id) {
        return { ...goal, completed };
      }
      return goal;
    });
    
    updateGoals(updatedAllGoals);
    toast(completed ? "Goal completed! 🎉" : "Goal marked as pending");
    
    // Reload mission data to get updated progress
    loadMissionData();
  };
  
  const handleAddGoal = (goal: Goal) => {
    // Add to local state
    setGoals([...goals, goal]);
    
    // Add to storage
    const allGoals = getGoals();
    updateGoals([...allGoals, goal]);
    
    toast.success("New goal added!");
    
    // Reload mission data to get updated progress
    loadMissionData();
  };
  
  if (!category) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold">{category.name}</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Mission Progress</span>
            <ProgressRing progress={category.progress} size={70} color={`text-${category.color}`} />
          </CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            {category.progress < 25 ? "Just getting started! Keep going." :
             category.progress < 50 ? "Making progress! You're on the right track." :
             category.progress < 75 ? "Great progress! Keep up the momentum." :
             "Almost there! You're doing amazing!"}
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-lg font-bold">{stats.completedGoals}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex justify-center">
                <Flag className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-lg font-bold">{stats.pendingGoals}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex justify-center">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-lg font-bold">{category.progress}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Mission Goals</h2>
        <Button 
          size="sm" 
          className="gap-1"
          onClick={() => setIsAddGoalModalOpen(true)}
        >
          <PlusCircle size={16} />
          <span>Add Goal</span>
        </Button>
      </div>
      
      <div className="space-y-3">
        {goals.length > 0 ? (
          goals.map(goal => (
            <GoalItem 
              key={goal.id} 
              goal={goal} 
              onToggle={handleToggleGoal} 
            />
          ))
        ) : (
          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">No goals added to this mission yet.</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddGoalModalOpen(true)}
              >
                Add Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {goals.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Mission Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <BarChart2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm">
                  {category.progress < 30 ? 
                    "You're just getting started with this mission. Try setting smaller, achievable goals to build momentum." :
                    category.progress < 60 ?
                    "You're making good progress! Keep consistent with your goals to maintain momentum." :
                    "You're excelling at this mission! Consider setting more challenging goals to push your limits."}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/goals')}
            >
              View All Goals
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <AddGoalModal 
        open={isAddGoalModalOpen}
        onOpenChange={setIsAddGoalModalOpen}
        onAddGoal={handleAddGoal}
        preselectedCategoryId={id}
      />
    </div>
  );
};

export default MissionDetail;
