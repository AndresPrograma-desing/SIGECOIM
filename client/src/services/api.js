import axios from 'axios';

const getBaseURL = () => {
  const { hostname, protocol } = window.location;

  // 1. Si estamos en Dev Tunnels (ej. g27frlv5-5173.use2.devtunnels.ms)
  if (hostname.includes('devtunnels.ms')) {
    // Reemplaza el sufijo del puerto del frontend (-5173) por el del backend (-3003)
    const backendHostname = hostname.replace('-5173', '-3003');
    return `https://${backendHostname}/api`;
  }

  // 2. Si estamos en red local o localhost (ej. 192.168.1.50 o localhost)
  // Mantenemos la IP/host del navegador y apuntamos al puerto 3003 del backend
  return `${protocol}//${hostname}:3003/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
