
import React, { useState, useEffect } from 'react';
import { getGoals, updateGoals, getCategories } from '@/utils/data';
import { Goal, ImprovementCategory } from '@/types';
import GoalItem from '@/components/GoalItem';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<ImprovementCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    const loadedGoals = getGoals();
    const loadedCategories = getCategories();
    setGoals(loadedGoals);
    setCategories(loadedCategories);
  }, []);
  
  const handleToggleGoal = (id: string, completed: boolean) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, completed } : goal
    );
    
    setGoals(updatedGoals);
    updateGoals(updatedGoals);
    toast(completed ? "Goal completed! 🎉" : "Goal marked as pending");
  };
  
  const filteredGoals = activeTab === "all" 
    ? goals 
    : activeTab === "completed"
      ? goals.filter(goal => goal.completed)
      : activeTab === "pending"
        ? goals.filter(goal => !goal.completed)
        : goals.filter(goal => goal.categoryId === activeTab);
  
  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Button size="sm" className="gap-1">
          <PlusCircle size={16} />
          <span>Add Goal</span>
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-3">
            {filteredGoals.length > 0 ? (
              filteredGoals.map(goal => (
                <GoalItem 
                  key={goal.id} 
                  goal={goal} 
                  onToggle={handleToggleGoal} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No goals to display</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;
