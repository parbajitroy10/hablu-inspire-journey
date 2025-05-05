
import React from 'react';
import { Achievement } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Star, Compass } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const getIcon = () => {
    switch (achievement.icon) {
      case 'check-circle': return <CheckCircle className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'compass': return <Compass className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col items-center p-4 rounded-xl text-center",
      achievement.unlocked 
        ? "bg-gradient-to-b from-violet-500/20 to-indigo-500/20" 
        : "bg-muted/50 filter grayscale opacity-50"
    )}>
      <div className={cn(
        "p-3 rounded-full mb-2",
        achievement.unlocked ? "bg-primary/20 text-primary animate-pulse-subtle" : "bg-muted text-muted-foreground"
      )}>
        {getIcon()}
      </div>
      <h4 className="font-semibold text-sm">{achievement.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
    </div>
  );
};

export default AchievementBadge;
