import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import Login from './pages/Login';
import Estudiantes from './pages/Estudiantes';
import Instrumentos from './pages/Instrumentos';
import Comodatos from './pages/Comodatos';
import Usuarios from './pages/Usuarios';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/estudiantes" element={<Estudiantes />} />
              <Route path="/instrumentos" element={<Instrumentos />} />
              <Route path="/comodatos" element={<Comodatos />} />
              <Route element={<AdminRoute />}>
                <Route path="/usuarios" element={<Usuarios />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/estudiantes" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
