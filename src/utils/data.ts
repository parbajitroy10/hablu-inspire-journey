
import { ImprovementCategory, Goal, Achievement, DailyQuote, User } from '../types';

// Get data from local storage or return default values
export const getLocalData = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Save data to local storage
export const saveLocalData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Default categories
export const defaultCategories: ImprovementCategory[] = [
  {
    id: 'academics',
    name: 'Academics',
    description: 'Track your academic progress and study habits',
    icon: 'book',
    progress: 35,
    color: 'improvement-academics',
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    id: 'skills',
    name: 'Skills',
    description: 'Develop new abilities and track your learning',
    icon: 'award',
    progress: 45,
    color: 'improvement-skills',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Monitor your physical health and fitness goals',
    icon: 'activity',
    progress: 60,
    color: 'improvement-fitness',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    id: 'career',
    name: 'Career',
    description: 'Set and achieve your professional goals',
    icon: 'trending-up',
    progress: 25,
    color: 'improvement-career',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    id: 'mental',
    name: 'Mental Health',
    description: 'Focus on your mental wellbeing and mindfulness',
    icon: 'heart',
    progress: 50,
    color: 'improvement-mental',
    gradient: 'from-indigo-200 to-purple-300',
  },
];

// Default goals
export const defaultGoals: Goal[] = [
  {
    id: 'goal1',
    categoryId: 'academics',
    title: 'Complete term paper',
    description: 'Finish 10-page research paper for Psychology class',
    completed: false,
    dueDate: '2025-05-15',
  },
  {
    id: 'goal2',
    categoryId: 'academics',
    title: 'Review calculus',
    description: 'Study for upcoming exam',
    completed: true,
    dueDate: '2025-05-03',
  },
  {
    id: 'goal3',
    categoryId: 'skills',
    title: 'Learn React basics',
    description: 'Complete online tutorial on React fundamentals',
    completed: false,
    dueDate: '2025-05-20',
  },
  {
    id: 'goal4',
    categoryId: 'fitness',
    title: 'Run 5k',
    description: 'Prepare for campus charity run',
    completed: false,
    dueDate: '2025-05-25',
  },
  {
    id: 'goal5',
    categoryId: 'career',
    title: 'Update resume',
    description: 'Add recent projects and experiences',
    completed: false,
    dueDate: '2025-05-10',
  },
  {
    id: 'goal6',
    categoryId: 'mental',
    title: 'Daily meditation',
    description: '10 minutes of mindfulness each morning',
    completed: false,
    dueDate: '2025-05-06',
  },
];

// Default achievements
export const defaultAchievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Set your first goal',
    icon: 'check-circle',
    unlocked: true,
  },
  {
    id: 'ach2',
    title: 'Consistent Effort',
    description: 'Complete 5 goals in a single category',
    icon: 'star',
    unlocked: false,
  },
  {
    id: 'ach3',
    title: 'Well-Rounded',
    description: 'Set at least one goal in each category',
    icon: 'compass',
    unlocked: false,
  },
];

// List of inspirational quotes
const quotesList: DailyQuote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs"
  }
];

// Get daily inspirational quote
export const getDailyQuote = (): DailyQuote => {
  const today = new Date();
  // Fix type error: Convert Date objects to numbers before arithmetic operation
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return quotesList[dayOfYear % quotesList.length];
};

// Get category data
export const getCategories = (): ImprovementCategory[] => {
  return getLocalData('inspire-categories', defaultCategories);
};

// Get goals data
export const getGoals = (): Goal[] => {
  return getLocalData('inspire-goals', defaultGoals);
};

// Get achievements data
export const getAchievements = (): Achievement[] => {
  return getLocalData('inspire-achievements', defaultAchievements);
};

// Save category updates
export const updateCategories = (categories: ImprovementCategory[]): void => {
  saveLocalData('inspire-categories', categories);
};

// Save goals updates
export const updateGoals = (goals: Goal[]): void => {
  saveLocalData('inspire-goals', goals);
  
  // Automatically update category progress based on goals
  const categories = getCategories();
  const updatedCategories = categories.map(category => {
    const categoryGoals = goals.filter(goal => goal.categoryId === category.id);
    const totalGoals = categoryGoals.length;
    
    if (totalGoals === 0) return category;
    
    const completedGoals = categoryGoals.filter(goal => goal.completed).length;
    const progress = Math.round((completedGoals / totalGoals) * 100);
    
    return {
      ...category,
      progress
    };
  });
  
  updateCategories(updatedCategories);
  
  // Update user overall progress
  updateUserProgress();
};

// Calculate overall progress
export const calculateOverallProgress = (categories: ImprovementCategory[]): number => {
  if (categories.length === 0) return 0;
  
  const totalProgress = categories.reduce((sum, category) => sum + category.progress, 0);
  return Math.round(totalProgress / categories.length);
};

// Update user overall progress
export const updateUserProgress = (): void => {
  const user = getLocalData('inspire-user', null);
  if (!user) return;
  
  const categories = getCategories();
  const overallProgress = calculateOverallProgress(categories);
  
  const updatedUser = {
    ...user,
    overallProgress
  };
  
  saveLocalData('inspire-user', updatedUser);
};

// Get pending goals (not completed and due soon)
export const getPendingGoals = (goals: Goal[], days: number = 7): Goal[] => {
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);
  
  return goals.filter(goal => {
    if (goal.completed) return false;
    if (!goal.dueDate) return true;
    
    const dueDate = new Date(goal.dueDate);
    return dueDate <= future;
  });
};

// Generate motivation message based on user goals and progress
export const generateMotivationMessage = (): string => {
  const user = getLocalData('inspire-user', null);
  const categories = getCategories();
  const goals = getGoals();
  
  if (!user) return "Set your goals today and start your journey!";
  
  const pendingCount = getPendingGoals(goals).length;
  const overallProgress = user.overallProgress || 0;
  
  // Get the category with lowest progress that has goals
  const categoriesWithGoals = categories.filter(cat => 
    goals.some(goal => goal.categoryId === cat.id)
  );
  
  const lowestCategory = categoriesWithGoals.sort((a, b) => a.progress - b.progress)[0];
  
  if (pendingCount === 0) {
    return "Great job! You've completed all your pending tasks. Add new goals to keep improving!";
  }
  
  if (overallProgress < 30) {
    return `You're just getting started! Focus on your ${lowestCategory?.name || 'goals'} to build momentum.`;
  } else if (overallProgress < 60) {
    return `You're making good progress! Keep working on your ${lowestCategory?.name || 'goals'} to reach the next level.`;
  } else {
    return "You're doing amazing! Keep up the great work to reach your full potential!";
  }
};

// Get stat for specific goal type (completed goals, ongoing, etc)
export const getGoalStats = () => {
  const goals = getGoals();
  const total = goals.length;
  const completed = goals.filter(goal => goal.completed).length;
  const pending = total - completed;
  const dueToday = goals.filter(goal => {
    if (goal.completed) return false;
    if (!goal.dueDate) return false;
    
    const today = new Date();
    const dueDate = new Date(goal.dueDate);
    
    return dueDate.toDateString() === today.toDateString();
  }).length;
  
  return { total, completed, pending, dueToday };
};
