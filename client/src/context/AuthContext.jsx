import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest, sdkLogin as sdkLoginRequest } from '../services/auth';

const TOKEN_KEY = 'sigecoim_token';
const USER_KEY = 'sigecoim_usuario';

const AuthContext = createContext(null);

function readUsuario() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(readUsuario);

  const login = async (email, password) => {
    const { token, usuario: nuevoUsuario } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
    return nuevoUsuario;
  };

  const loginWithSdk = async (ticket) => {
    const { token, usuario: nuevoUsuario } = await sdkLoginRequest(ticket);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
    return nuevoUsuario;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  };

  const puedeAdministrarUsuarios = usuario?.rol === 'ADMINISTRADOR' || usuario?.rol === 'ANALISTA_BIENES';

  const value = useMemo(
    () => ({ usuario, login, loginWithSdk, logout, puedeAdministrarUsuarios }),
    [usuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
