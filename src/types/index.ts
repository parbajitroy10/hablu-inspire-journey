
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
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
  requirements?: string[];
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
  joinDate?: Date;
  streak?: number;
  points?: number;
  level?: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  preferences?: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
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

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserGoalStat {
  total: number;
  completed: number;
  pending: number;
  dueToday: number;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  action: 'goal_completed' | 'goal_added' | 'mission_started' | 'achievement_unlocked';
  timestamp: Date;
  details: {
    goalId?: string;
    missionId?: string;
    achievementId?: string;
    description: string;
  };
}

export interface UserStreak {
  current: number;
  longest: number;
  lastActivity: Date;
}
