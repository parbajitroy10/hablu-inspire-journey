
export interface ImprovementCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  color: string;
  gradient: string;
}

export interface Goal {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface DailyQuote {
  text: string;
  author: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  university?: string;
  overallProgress: number;
  currentMood?: 'happy' | 'neutral' | 'sad' | 'excited' | 'tired';
  lastCheckIn?: Date;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  progress: number;
  goalCount: number;
  completedGoalCount: number;
  icon: string;
  color: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  missionId: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}
