import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
  IconButton
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import BrandMark from '../components/illustrations/BrandMark';
import LoginArt from '../components/illustrations/LoginArt';
import { ink, surface } from '../theme/colors';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, usuario } = response.data;
      onLoginSuccess(token, usuario);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'No se pudo conectar al servidor. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: surface.background,
      }}
    >
      {/* Panel ilustrativo (Izquierdo) */}
      <Box
        sx={{
          position: 'relative',
          flex: '0 0 44%',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#ffffff',
          p: 6,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <LoginArt />
        </Box>

        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BrandMark size={30} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: '0.02em' }}>
            SIGECOIM
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Typography
            variant="h2"
            sx={{ color: '#ffffff', fontSize: { md: '2.4rem', lg: '2.8rem' }, lineHeight: 1.15, mb: 2 }}
          >
            Cada instrumento, con su propia historia.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.72)', maxWidth: 380 }}>
            Gestión de comodatos para la Sinfónica Infantil: inventario, préstamos y devoluciones en un
            solo lugar.
          </Typography>
        </Box>
      </Box>

      {/* Panel de formulario (Derecho) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: { xs: '#ffffff', md: '#f8fafc' }, 
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 4, sm: 5 },
            // Borde mucho más cuadrado y elegante (reducido a 2)
            borderRadius: 1, 
            backgroundColor: '#ffffff',
            boxShadow: { xs: 'none', md: '0px 8px 30px -10px rgba(0,0,0,0.1)' },
            border: { xs: 'none', md: '1px solid #e2e8f0' }
          }}
        >
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1.5,
              mb: 4,
              color: ink.main,
            }}
          >
            <BrandMark size={30} />
            <Typography variant="h5" fontWeight={700}>
              SIGECOIM
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '1.7rem', sm: '2rem' }, fontWeight: 700, color: ink.main }}>
            Bienvenido de nuevo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Ingresa tus credenciales para continuar.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* 
            Contenedor Flexbox con 'gap: 3.5'. 
            Esto es lo que evita que los inputs queden pegados, 
            ya que fuerza una separación de ~28px entre cada elemento.
          */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3.5, // Espaciado estricto entre elementos
              mt: 2
            }}
          >
            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 1, color: 'text.secondary' }}>
                      <Mail size={18} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 1, color: 'text.secondary' }}>
                      <Lock size={18} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ 
                py: 1.5, 
                mt: 1, // Un empujoncito extra hacia abajo para separar el botón
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2, // Mismo borde sutil que la tarjeta
                boxShadow: '0 4px 14px 0 rgba(226, 88, 62, 0.39)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(226, 88, 62, 0.23)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;