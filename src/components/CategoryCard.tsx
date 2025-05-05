
import React from 'react';
import { ImprovementCategory } from '@/types';
import ProgressRing from './ProgressRing';
import { cn } from '@/lib/utils';
import { Book, Award, Activity, TrendingUp, Heart } from 'lucide-react';

interface CategoryCardProps {
  category: ImprovementCategory;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const getIcon = () => {
    switch (category.icon) {
      case 'book': return <Book className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      case 'activity': return <Activity className="h-6 w-6" />;
      case 'trending-up': return <TrendingUp className="h-6 w-6" />;
      case 'heart': return <Heart className="h-6 w-6" />;
      default: return <Book className="h-6 w-6" />;
    }
  };

  return (
    <div 
      className={cn(
        "category-card bg-gradient-to-br", 
        category.gradient,
        "animate-fade-in"
      )}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-full bg-white/20 mb-3">
          {getIcon()}
        </div>
        <ProgressRing 
          progress={category.progress} 
          size={48} 
          strokeWidth={4} 
          color="stroke-white" 
        />
      </div>
      <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
      <p className="text-sm opacity-80">{category.description}</p>
    </div>
  );
};

export default CategoryCard;
