import React from 'react';
import { Drawer, Box, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Music, ClipboardList, Users } from 'lucide-react';
import BrandMark from './illustrations/BrandMark';
import { ink } from '../theme/colors';

const Sidebar = ({ activePage, setActivePage, drawerWidth, user }) => {
  const isAdmin = user?.rol === 'ADMINISTRADOR';

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: ink.main,
          color: '#ffffff',
          borderRight: 'none',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Logo Corporativo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mx: 2,
          my: 3,
          px: 2,
          py: 2.5,
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BrandMark size={28} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#ffffff" sx={{ lineHeight: 1.2 }}>
            SIGECOIM
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" sx={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            SINFÓNICA INFANTIL
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mx: 2, mb: 2 }} />

      {/* Menú de Navegación */}
      <List sx={{ px: 2 }}>
        {/* Instrumentos */}
        <ListItem disablePadding sx={{ mb: 1.5 }}>
          <ListItemButton
            selected={activePage === 'instrumentos'}
            onClick={() => setActivePage('instrumentos')}
            sx={{
              borderRadius: '6px',
              '&.Mui-selected': {
                backgroundColor: 'rgba(232, 93, 78, 0.16)',
                borderLeft: '4px solid #E85D4E',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#F3846F',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: activePage === 'instrumentos' ? '#F3846F' : 'rgba(255, 255, 255, 0.6)' }}>
              <Music size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Instrumentos"
              primaryTypographyProps={{
                fontWeight: activePage === 'instrumentos' ? 'bold' : 'normal',
                color: '#ffffff',
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Comodatos */}
        <ListItem disablePadding sx={{ mb: 1.5 }}>
          <ListItemButton
            selected={activePage === 'comodatos'}
            onClick={() => setActivePage('comodatos')}
            sx={{
              borderRadius: '6px',
              '&.Mui-selected': {
                backgroundColor: 'rgba(232, 93, 78, 0.16)',
                borderLeft: '4px solid #E85D4E',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#F3846F',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: activePage === 'comodatos' ? '#F3846F' : 'rgba(255, 255, 255, 0.6)' }}>
              <ClipboardList size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Comodatos"
              primaryTypographyProps={{
                fontWeight: activePage === 'comodatos' ? 'bold' : 'normal',
                color: '#ffffff',
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Usuarios (Exclusivo para ADMINISTRADOR) */}
        {isAdmin && (
          <ListItem disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              selected={activePage === 'usuarios'}
              onClick={() => setActivePage('usuarios')}
              sx={{
                borderRadius: '6px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(232, 93, 78, 0.16)',
                  borderLeft: '4px solid #E85D4E',
                  color: '#ffffff',
                  '& .MuiListItemIcon-root': {
                    color: '#F3846F',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: activePage === 'usuarios' ? '#F3846F' : 'rgba(255, 255, 255, 0.6)' }}>
                <Users size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Usuarios"
                primaryTypographyProps={{
                  fontWeight: activePage === 'usuarios' ? 'bold' : 'normal',
                  color: '#ffffff',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
