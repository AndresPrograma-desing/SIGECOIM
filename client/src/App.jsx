import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import api from './services/api';
import theme from './theme';
import { surface } from './theme/colors';
import Instrumentos from './pages/Instrumentos';
import Comodatos from './pages/Comodatos';
import Usuarios from './pages/Usuarios';
import Estudiantes from './pages/Estudiantes';
import Login from './pages/Login';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

const drawerWidth = 260;

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('instrumentos');

  // Inicializar sesión
  useEffect(() => {
    const savedToken = localStorage.getItem('sigecoim_token');
    const savedUser = localStorage.getItem('sigecoim_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('sigecoim_token', newToken);
    localStorage.setItem('sigecoim_user', JSON.stringify(newUser));
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sigecoim_token');
    localStorage.removeItem('sigecoim_user');
    delete api.defaults.headers.common['Authorization'];
  };

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLoginSuccess={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: surface.background }}>
        {/* Cabecera Superior Desacoplada */}
        <Topbar user={user} onLogout={handleLogout} drawerWidth={drawerWidth} />

        {/* Menú Lateral Desacoplado con validación de roles */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} drawerWidth={drawerWidth} user={user} />

        {/* Contenedor del Contenido */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: surface.background,
            p: 4,
            mt: '88px',
            minHeight: 'calc(100vh - 88px)',
          }}
        >
          {activePage === 'instrumentos' && <Instrumentos />}
          {activePage === 'estudiantes' && <Estudiantes />}
          {activePage === 'comodatos' && <Comodatos />}
          {activePage === 'usuarios' && user?.rol === 'ANALISTA_BIENES' && <Usuarios />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
