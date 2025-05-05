
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, List, Award, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: <Home size={20} />, text: "Home", path: "/dashboard" },
    { icon: <List size={20} />, text: "Goals", path: "/goals" },
    { icon: <BarChart size={20} />, text: "Progress", path: "/progress" },
    { icon: <Award size={20} />, text: "Achievements", path: "/achievements" },
    { icon: <User size={20} />, text: "Profile", path: "/profile" }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-2 z-10">
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
          <span className="text-xs mt-1">{item.text}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
