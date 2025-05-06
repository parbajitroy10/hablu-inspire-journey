
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Award, LayoutDashboard, CheckSquare, GraduationCap, Calendar, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === path || currentPath.startsWith('/mission');
    }
    return currentPath === path;
  };
  
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      path: '/goals',
      label: 'Goals',
      icon: <CheckSquare size={20} />
    },
    {
      path: '/events',
      label: 'Events',
      icon: <Calendar size={20} />
    },
    {
      path: '/cgpa',
      label: 'CGPA',
      icon: <GraduationCap size={20} />
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User size={20} />
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-2 z-10 max-w-md mx-auto shadow-lg">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={cn(
            "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
            isActive(item.path) 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
