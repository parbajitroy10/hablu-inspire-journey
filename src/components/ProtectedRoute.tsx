
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Redirect to auth page, but save the current location they were trying to go to
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
