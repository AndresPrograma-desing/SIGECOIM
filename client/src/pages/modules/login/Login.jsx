import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Guitar, Piano, Music2 } from 'lucide-react';
import { TextField, Button, ErrorMessage } from 'anteriority-ui';
import { useAuth } from '../../../context/AuthContext';
import logo1 from '../../../assets/logo1.png';
import logoDark from '../../../assets/login-logo-dark.png';
import fotoNinos from '../../../assets/login-foto-ninos.png';

const CAROUSEL_IMAGES = [
  { src: logo1, fit: 'contain' },
  { src: logoDark, fit: 'contain' },
  { src: fotoNinos, fit: 'cover' },
];
const CAROUSEL_INTERVAL_MS = 4000;

const hairlineFieldSx = {
  m: 0,
  '& .MuiInputLabel-root': {
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#757575',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
  '& .MuiInput-root': { fontSize: 13, color: '#000000' },
  '& .MuiInput-root:before': { borderBottomColor: '#000000' },
  '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottomColor: '#000000' },
  '& .MuiInput-root:after': { borderBottomColor: '#000000' },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

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
        background: '#ffffff',
      }}
    >
      <div
        style={{
          width: 'min(420px, 100%)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 56px',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            width: '100%',
            maxWidth: 320,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Didot', 'Bodoni Moda', Georgia, serif",
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: '0.02em',
                color: '#000000',
              }}
            >
              EL SISTEMA
            </h1>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: 13,
                fontWeight: 300,
                color: '#757575',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Inicia sesión para continuar
            </p>
          </div>

          {error && <ErrorMessage message={error} title="Error de autenticación" variant="danger" />}

          <div style={{ position: 'relative' }}>
            <Guitar
              size={96}
              strokeWidth={1}
              style={{ position: 'absolute', top: -20, right: -24, color: '#000000', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(18deg)' }}
            />
            <Piano
              size={80}
              strokeWidth={1}
              style={{ position: 'absolute', bottom: -28, left: -16, color: '#000000', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(-10deg)' }}
            />
            <Music2
              size={56}
              strokeWidth={1}
              style={{ position: 'absolute', top: '38%', right: 4, color: '#000000', opacity: 0.05, pointerEvents: 'none' }}
            />

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TextField
                label="Correo electrónico"
                type="email"
                placeholder="correo@sigecoim.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                variant="standard"
                sx={hairlineFieldSx}
              />

              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="standard"
                sx={hairlineFieldSx}
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
                        color: '#757575',
                        padding: 4,
                      }}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  ),
                }}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="outline"
            borderColor="#000000"
            color="#000000"
            fullWidth
            loading={loading}
            sx={{
              mt: 2,
              borderRadius: 0,
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '12px 20px',
            }}
          >
            Ingresar
          </Button>
        </form>
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          position: 'relative',
          backgroundColor: '#000000',
          overflow: 'hidden',
        }}
      >
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={image.src}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${image.src})`,
              backgroundSize: image.fit,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: index === slideIndex ? 1 : 0,
              transition: 'opacity 900ms ease-in-out',
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {CAROUSEL_IMAGES.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSlideIndex(index)}
              aria-label={`Mostrar imagen ${index + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: index === slideIndex ? '#ffffff' : 'rgba(255,255,255,0.35)',
                transition: 'background-color 200ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
