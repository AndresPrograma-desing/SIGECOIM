import React from 'react';
import { Drawer, Box, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Music, ClipboardList, Users, GraduationCap } from 'lucide-react';
import logo1 from '../assets/img/Logo1.jpeg';
import { ink } from '../theme/colors';

const Sidebar = ({ activePage, setActivePage, drawerWidth, user }) => {
  const isAdmin = user?.rol === 'ANALISTA_BIENES';

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
          justifyContent: 'center',
          alignItems: 'center',
          mx: 2,
          my: 3,
          p: 1.5,
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <img src={logo1} alt="Logo" style={{ height: 48, width: '100%', objectFit: 'contain', borderRadius: '6px' }} />
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

        {/* Estudiantes */}
        <ListItem disablePadding sx={{ mb: 1.5 }}>
          <ListItemButton
            selected={activePage === 'estudiantes'}
            onClick={() => setActivePage('estudiantes')}
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
            <ListItemIcon sx={{ minWidth: 40, color: activePage === 'estudiantes' ? '#F3846F' : 'rgba(255, 255, 255, 0.6)' }}>
              <GraduationCap size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Estudiantes"
              primaryTypographyProps={{
                fontWeight: activePage === 'estudiantes' ? 'bold' : 'normal',
                color: '#ffffff',
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Usuarios (Exclusivo para ANALISTA_BIENES) */}
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
