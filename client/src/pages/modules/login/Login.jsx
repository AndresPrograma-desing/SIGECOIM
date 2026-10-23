import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { TextField, Button, ErrorMessage } from 'anteriority-ui';
import { useAuth } from '../../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('El correo y la contraseña son requeridos.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/estudiantes', { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fb',
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '40px 32px',
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid #d4e0ed',
          boxShadow: '0 8px 30px rgba(11, 53, 88, 0.06)',
          width: '100%',
          maxWidth: 380,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0b3558' }}>SIGECOIM</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#476788' }}>Inicia sesión para continuar</p>
        </div>

        {error && <ErrorMessage message={error} title="Error de autenticación" variant="danger" />}

        <TextField
          label="Correo electrónico"
          type="email"
          placeholder="correo@sigecoim.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <TextField
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#476788',
                  padding: 4,
                }}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            ),
          }}
        />

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Ingresar
        </Button>
      </form>
    </div>
  );
}
