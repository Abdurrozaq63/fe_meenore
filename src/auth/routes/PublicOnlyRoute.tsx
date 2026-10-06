import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-sm text-[var(--muted-foreground)]">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/archives" replace />;
  }

  return <Outlet />;
}
