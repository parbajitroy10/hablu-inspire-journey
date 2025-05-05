
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <span className="text-3xl">🔍</span>
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <p className="text-muted-foreground mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
