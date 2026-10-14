import { request } from 'anteriority-ui/common/api/client';

export const getComodatos = () => request('/comodatos');
export const createComodato = (data) => request('/comodatos', { method: 'POST', body: data });
export const updateComodato = (id, data) => request(`/comodatos/${id}`, { method: 'PUT', body: data });
export const deleteComodato = (id) => request(`/comodatos/${id}`, { method: 'DELETE' });
export const registrarDevolucion = (id, data) => request(`/comodatos/${id}/devolucion`, { method: 'POST', body: data });
