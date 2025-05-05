
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategories, getGoals, updateGoals } from '@/utils/data';
import { ImprovementCategory, Goal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import GoalItem from '@/components/GoalItem';
import ProgressRing from '@/components/ProgressRing';
import AddGoalModal from '@/components/AddGoalModal';
import { toast } from 'sonner';

const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ImprovementCategory | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  
  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }
    
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
  }, [id, navigate]);
  
  const handleToggleGoal = (id: string, completed: boolean) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, completed } : goal
    );
    
    setGoals(updatedGoals);
    
    // Update all goals in storage
    const allGoals = getGoals();
    const updatedAllGoals = allGoals.map(goal => {
      if (goal.id === id) {
        return { ...goal, completed };
      }
      return goal;
    });
    
    updateGoals(updatedAllGoals);
    toast(completed ? "Goal completed! 🎉" : "Goal marked as pending");
    
    // Update category progress (simplified calculation - in real app would be more sophisticated)
    const completedCount = updatedGoals.filter(g => g.completed).length;
    const totalCount = updatedGoals.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    if (category) {
      const categories = getCategories();
      const updatedCategories = categories.map(c => 
        c.id === category.id ? { ...c, progress } : c
      );
      
      // Here you would update categories in your data store
      // updateCategories(updatedCategories);
      
      setCategory({ ...category, progress });
    }
  };
  
  const handleAddGoal = (goal: Goal) => {
    // Add to local state
    setGoals([...goals, goal]);
    
    // Add to storage
    const allGoals = getGoals();
    updateGoals([...allGoals, goal]);
    
    toast.success("New goal added!");
  };
  
  if (!category) {
    return <div className="p-6">Loading...</div>;
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
            <ProgressRing progress={category.progress} size={60} />
          </CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {category.progress < 25 ? "Just getting started! Keep going." :
             category.progress < 50 ? "Making progress! You're on the right track." :
             category.progress < 75 ? "Great progress! Keep up the momentum." :
             "Almost there! You're doing amazing!"}
          </p>
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
            <p className="text-muted-foreground mb-4">No goals added to this mission yet.</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddGoalModalOpen(true)}
            >
              Add Your First Goal
            </Button>
          </Card>
        )}
      </div>
      
      <AddGoalModal 
        open={isAddGoalModalOpen}
        onOpenChange={setIsAddGoalModalOpen}
        onAddGoal={handleAddGoal}
      />
    </div>
  );
};

export default MissionDetail;
