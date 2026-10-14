import { request } from 'anteriority-ui/common/api/client';

export const getUsuarios = () => request('/usuarios');
export const createUsuario = (data) => request('/usuarios', { method: 'POST', body: data });
export const updateUsuario = (id, data) => request(`/usuarios/${id}`, { method: 'PUT', body: data });
export const toggleEstadoUsuario = (id) => request(`/usuarios/${id}/toggle`, { method: 'PUT' });
export const deleteUsuario = (id) => request(`/usuarios/${id}`, { method: 'DELETE' });
