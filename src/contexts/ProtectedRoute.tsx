// ProtectedRoute.tsx
import { useAuth } from './AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ requiredPermission }: { requiredPermission?: string }) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};