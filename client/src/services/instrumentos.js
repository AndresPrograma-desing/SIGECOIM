import { request } from 'anteriority-ui/common/api/client';

export const getInstrumentos = () => request('/instrumentos');
export const createInstrumento = (data) => request('/instrumentos', { method: 'POST', body: data });
export const updateInstrumento = (id, data) => request(`/instrumentos/${id}`, { method: 'PUT', body: data });
export const deleteInstrumento = (id) => request(`/instrumentos/${id}`, { method: 'DELETE' });
