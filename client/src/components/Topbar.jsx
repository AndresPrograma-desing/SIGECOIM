import React from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton } from '@mui/material';
import { LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { ink } from '../theme/colors';

const Topbar = ({ user, onLogout, drawerWidth }) => {
  if (!user) return null;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: ink.main,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', px: 4 }}>
        {/* Usando sx para garantizar alineación horizontal en el navegador */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle2" color="#ffffff" fontWeight="bold">
              {user.nombre}
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
              {user.email} • {user.rol}
            </Typography>
          </Box>
          <UserAvatar nombre={user.nombre} />
          <IconButton onClick={onLogout} sx={{ color: '#ffffff' }} title="Cerrar Sesión">
            <LogOut size={18} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
