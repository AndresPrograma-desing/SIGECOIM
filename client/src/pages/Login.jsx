import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Loading } from 'anteriority-ui';
import { useAuth } from '../context/AuthContext';

const CLIENT_KEY = import.meta.env.VITE_CONTEXTHUB_CLIENT_KEY || '1158a6f7-02be-4001-8a3f-7cd2539ac7fe';
const CONTEXTHUB_URL = import.meta.env.VITE_CONTEXTHUB_URL || 'http://localhost:3005';

export default function Login() {
  const { loginWithSdk } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    let unmountFn = null;
    let isCancelled = false;

    const initWidget = () => {
      if (!window.ContextHubLogin || !containerRef.current || isCancelled) return;

      // Si ya hay un iframe insertado, marcar como listo
      const existingIframe = containerRef.current.querySelector('iframe');
      if (existingIframe) {
        setSdkReady(true);
        return;
      }

      const widget = window.ContextHubLogin.mount(containerRef.current, {
        clientKey: CLIENT_KEY,
        height: '450px',
        width: '100%',
        onSuccess: async (result) => {
          if (isCancelled) return;
          setError('');
          setLoading(true);
          try {
            await loginWithSdk(result.ticket);
            navigate('/estudiantes', { replace: true });
          } catch (err) {
            setError(err.message || 'Error al validar la sesión con SIGECOIM');
          } finally {
            if (!isCancelled) setLoading(false);
          }
        },
        onError: (err) => {
          if (isCancelled) return;
          const errorMap = {
            invalid_credentials: 'Las credenciales ingresadas son incorrectas.',
            rate_limited: 'Demasiados intentos de acceso. Por favor, espera unos minutos.',
            client_not_found: 'Integración no encontrada o revocada.',
            network_error: 'Error de conexión con el servicio de autenticación.',
          };
          setError(errorMap[err?.error] || err?.error || 'Error al autenticar');
        },
      });

      if (widget && typeof widget.unmount === 'function') {
        unmountFn = widget.unmount;
      }

      // Escuchar cuando el iframe termina de cargar su contenido
      const iframe = containerRef.current.querySelector('iframe');
      if (iframe) {
        iframe.addEventListener('load', () => {
          setTimeout(() => {
            if (!isCancelled) setSdkReady(true);
          }, 400);
        });
      }

      // Temporizador de respaldo por si el evento load se disparó antes
      setTimeout(() => {
        if (!isCancelled) setSdkReady(true);
      }, 1500);
    };

    if (window.ContextHubLogin) {
      initWidget();
    } else {
      const script = document.createElement('script');
      script.src = `${CONTEXTHUB_URL}/sdk-login.js`;
      script.async = true;
      script.onload = () => {
        if (!isCancelled) initWidget();
      };
      script.onerror = () => {
        if (!isCancelled) {
          setError(`No se pudo conectar con el servidor de autenticación (${CONTEXTHUB_URL}).`);
        }
      };
      document.body.appendChild(script);
    }

    return () => {
      isCancelled = true;
      if (unmountFn) {
        unmountFn();
      }
    };
  }, [loginWithSdk, navigate]);

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
      {error && (
        <div style={{ width: '100%', maxWidth: 420, marginBottom: 16 }}>
          <ErrorMessage message={error} title="Error de autenticación" variant="danger" />
        </div>
      )}

      {/* Pantalla de carga mientras se procesa la sesión con SIGECOIM */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid #d4e0ed',
            boxShadow: '0 8px 30px rgba(11, 53, 88, 0.06)',
            width: '100%',
            maxWidth: 380,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0b3558' }}>SIGECOIM</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#476788' }}>Accediendo al sistema...</p>
          </div>
          <Loading
            phrases={[
              'Verificando credenciales...',
              'Iniciando sesión en SIGECOIM...',
              'Cargando tu panel de control...',
            ]}
            size="large"
            variant="default"
          />
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', maxWidth: 420, minHeight: 450 }}>
          {/* Pantalla de carga estética mientras el SDK y el iframe de ContextHub se inicializan */}
          {!sdkReady && !error && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid #d4e0ed',
                boxShadow: '0 8px 30px rgba(11, 53, 88, 0.06)',
                zIndex: 2,
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0b3558' }}>SIGECOIM</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#476788' }}>
                  Conectando servicio de autenticación...
                </p>
              </div>
              <Loading
                phrases={[
                  'Cargando sistema...',
                  'Conectando con el módulo seguro...',
                  'Inicializando formulario de acceso...',
                  'Casi listo...',
                ]}
                size="large"
                variant="default"
              />
            </div>
          )}

          {/* Contenedor del widget del SDK (se oculta suavemente hasta que esté 100% listo) */}
          <div
            ref={containerRef}
            id="contexthub-login"
            style={{
              width: '100%',
              minHeight: 450,
              opacity: sdkReady ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </div>
      )}
    </div>
  );
}
