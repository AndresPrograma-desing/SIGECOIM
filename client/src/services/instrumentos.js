import { request } from 'anteriority-ui/common/api/client';

export const getInstrumentos = (params) => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return request(`/instrumentos${qs}`);
};
export const createInstrumento = (data) => request('/instrumentos', { method: 'POST', body: data });
export const updateInstrumento = (id, data) => request(`/instrumentos/${id}`, { method: 'PUT', body: data });
export const deleteInstrumento = (id) => request(`/instrumentos/${id}`, { method: 'DELETE' });
export const getStockPorTipo = () => request('/instrumentos/stock-por-tipo');
export const getHistorialUbicacion = (id) => request(`/instrumentos/${id}/historial-ubicacion`);
