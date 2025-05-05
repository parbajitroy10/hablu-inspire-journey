
import React, { useState, useEffect } from 'react';
import { getAchievements } from '@/utils/data';
import { Achievement } from '@/types';
import AchievementBadge from '@/components/AchievementBadge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  useEffect(() => {
    const loadedAchievements = getAchievements();
    setAchievements(loadedAchievements);
  }, []);
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);
  
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Achievements</h1>
      
      <Card className="p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {unlockedCount}/{totalCount} unlocked
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge 
            key={achievement.id} 
            achievement={achievement} 
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
