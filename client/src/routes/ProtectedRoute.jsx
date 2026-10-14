import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { usuario, puedeAdministrarUsuarios } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (!puedeAdministrarUsuarios) return <Navigate to="/estudiantes" replace />;
  return <Outlet />;
}
