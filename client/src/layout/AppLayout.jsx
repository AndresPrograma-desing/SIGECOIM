import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, TopBar, NotificationsPanel } from 'anteriority-ui';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV } from '../constants/text';
import { topBarColors, notificationsPanelColors, commandPaletteColors } from '../theme/tokens';
import { NAV_ITEMS } from './constants';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { usuario, logout, puedeAdministrarUsuarios } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || puedeAdministrarUsuarios);
  const activeItem = items.find((item) => location.pathname.startsWith(item.path));

  const commandItems = items.map((item) => ({
    id: item.id,
    label: item.label,
    category: NAV.commandPaletteCategory,
    icon: item.icon,
    onSelect: () => navigate(item.path),
  }));

  useEffect(() => {
    if (!notificationsOpen) return undefined;
    const handlePointerDown = (event) => {
      if (notificationsRef.current?.contains(event.target)) return;
      setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [notificationsOpen]);

  return (
    <div className={styles.appLayout} style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        groups={[{ items }]}
        activeId={activeItem?.id}
        onSelect={(item) => navigate(item.path)}
        collapsible={false}
        user={{ email: usuario?.email }}
        userMenuItems={[
          { id: 'logout', label: NAV.logout, icon: LogOut, onClick: logout, variant: 'danger' },
        ]}
      />
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <TopBar
          title={activeItem?.label}
          searchProps={{
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: NAV.searchPlaceholder,
          }}
          actions={[
            { key: 'notifications', icon: Bell, tooltip: NAV.notifications, onClick: () => setNotificationsOpen((open) => !open) },
          ]}
          commandItems={commandItems}
          commandPalettePlaceholder={NAV.commandPalettePlaceholder}
          {...topBarColors}
          {...commandPaletteColors}
        />

        {notificationsOpen && (
          <div
            ref={notificationsRef}
            style={{
              position: 'absolute',
              top: 64,
              right: 20,
              width: 360,
              maxWidth: '92vw',
              zIndex: 20,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(11, 53, 88, 0.18)',
              border: '1px solid #e2e8f0',
            }}
          >
            <NotificationsPanel
              title={NAV.notifications}
              notifications={[]}
              emptyMessage={NAV.notificationsEmpty}
              {...notificationsPanelColors}
            />
          </div>
        )}

        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '32px', background: '#f8f9fb' }}>
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
}
