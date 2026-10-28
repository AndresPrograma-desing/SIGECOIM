import { configureApiClient } from 'anteriority-ui/common/api/client';

// Mismo criterio de auto-detección que tenía el frontend anterior (ver README raíz,
// sección "Guía de Pruebas Móviles"): si se accede por IP de red local o por un dev
// tunnel, la API apunta al mismo host pero puerto/sufijo del backend.
//
// En producción (build de Vite) el backend vive en otro dominio (ej. Render), así
// que se resuelve primero vía VITE_API_URL si está definida -- ver .env.production.
function resolveBaseURL() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const { hostname, protocol } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3003/api';
  }

  if (hostname.endsWith('.devtunnels.ms')) {
    return `${protocol}//${hostname.replace('-5173', '-3003')}/api`;
  }

  // IP de red local (192.168.x.x / 10.x.x.x)
  return `${protocol}//${hostname}:3003/api`;
}

export function setupApiClient() {
  configureApiClient({
    baseURL: resolveBaseURL(),
    getAuthToken: () => localStorage.getItem('sigecoim_token'),
  });
}
