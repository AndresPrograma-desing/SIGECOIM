import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, TopBar, NotificationsPanel } from 'anteriority-ui';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV } from '../constants/text';
import { topBarColors, notificationsPanelColors, commandPaletteColors } from '../theme/tokens';
import { NAV_ITEMS } from './constants';
import sidebarLogo from '../assets/sidebar-logo-light.png';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { logout, puedeAdministrarUsuarios } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        onSelect={(item) => {
          navigate(item.path);
          setMobileMenuOpen(false);
        }}
        collapsible={false}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        headerContent={
          <div
            style={{
              background: '#ffffff',
              borderRadius: 10,
              padding: '10px 14px',
              margin: '8px auto',
              maxWidth: 160,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={sidebarLogo}
              alt="El Sistema"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        }
      />
      <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <TopBar
          title={activeItem?.label}
          onMenuClick={() => setMobileMenuOpen(true)}
          searchProps={{
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: NAV.searchPlaceholder,
          }}
          commandItems={commandItems}
          commandPalettePlaceholder={NAV.commandPalettePlaceholder}
          actions={[
            { key: 'logout', icon: LogOut, tooltip: NAV.logout, onClick: logout },
          ]}
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
              boxShadow: '0 10px 25px rgba(62, 39, 35, 0.18)',
              border: '1px solid #e3d4c2',
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

        <main className={styles.main}>
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
}
