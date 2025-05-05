
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
