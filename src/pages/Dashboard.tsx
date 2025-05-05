
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<ImprovementCategory[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [quote, setQuote] = useState<DailyQuote>({ text: '', author: '' });
  const [overallProgress, setOverallProgress] = useState(0);
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
  }, []);
  
  const pendingGoals = getPendingGoals(goals, 7).slice(0, 3);
  
  return (
    <div className="pb-24">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">InspireMe</h1>
        <p className="text-muted-foreground mb-6">Your daily path to improvement</p>
        
        <QuoteCard quote={quote} />
      </div>
      
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Overall Progress</h2>
          <ProgressRing progress={overallProgress} size={50} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              onClick={() => navigate(`/category/${category.id}`)}
            />
          ))}
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Upcoming Goals</span>
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
                  onToggle={() => {}} 
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No upcoming goals. Add some new ones!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
