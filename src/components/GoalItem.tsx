
import React from 'react';
import { Goal } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string, completed: boolean) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onToggle }) => {
  const isOverdue = goal.dueDate && new Date(goal.dueDate) < new Date() && !goal.completed;
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg transition-all",
      goal.completed ? "bg-muted/50" : "bg-card",
      isOverdue ? "border-l-4 border-destructive" : ""
    )}>
      <Checkbox 
        checked={goal.completed}
        onCheckedChange={(checked) => onToggle(goal.id, !!checked)}
        className={cn(goal.completed ? "bg-primary border-primary" : "")}
      />
      <div className="flex-1">
        <h4 className={cn(
          "font-medium",
          goal.completed ? "line-through text-muted-foreground" : ""
        )}>
          {goal.title}
        </h4>
        <p className="text-sm text-muted-foreground">{goal.description}</p>
      </div>
      {goal.dueDate && (
        <div className={cn(
          "text-xs px-2 py-1 rounded-md",
          isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
        )}>
          {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  );
};

export default GoalItem;
