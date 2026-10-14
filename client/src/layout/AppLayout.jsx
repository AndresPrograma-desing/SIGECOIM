import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from 'anteriority-ui';
import { GraduationCap, Music, HandHeart, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV } from '../constants/text';

const NAV_ITEMS = [
  { id: 'estudiantes', label: NAV.estudiantes, icon: GraduationCap, path: '/estudiantes' },
  { id: 'instrumentos', label: NAV.instrumentos, icon: Music, path: '/instrumentos' },
  { id: 'comodatos', label: NAV.comodatos, icon: HandHeart, path: '/comodatos' },
  { id: 'usuarios', label: NAV.usuarios, icon: ShieldCheck, path: '/usuarios', adminOnly: true },
];

export default function AppLayout() {
  const { usuario, logout, puedeAdministrarUsuarios } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || puedeAdministrarUsuarios);
  const activeItem = items.find((item) => location.pathname.startsWith(item.path));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        groups={[{ items }]}
        activeId={activeItem?.id}
        onSelect={(item) => navigate(item.path)}
        user={{ email: usuario?.email }}
        userMenuItems={[
          { id: 'logout', label: NAV.logout, icon: LogOut, onClick: logout, variant: 'danger' },
        ]}
      />
      <main style={{ flex: 1, minWidth: 0, padding: '32px', background: '#f8f9fb' }}>
        <Outlet />
      </main>
    </div>
  );
}
