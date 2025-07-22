import { Navigate } from 'react-router-dom';
import { useMe } from '@/shared/lib';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isLoading, error } = useMe();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error || !user) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
