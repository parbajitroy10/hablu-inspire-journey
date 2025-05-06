
import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  showText = true 
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center",
        sizes[size]
      )}>
        <Sparkles className="text-white" size={size === 'lg' ? 24 : size === 'md' ? 18 : 14} />
      </div>
      
      {showText && (
        <span className={cn(
          "font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent",
          textSizes[size]
        )}>
          InspireMe
        </span>
      )}
    </div>
  );
};

export default Logo;
