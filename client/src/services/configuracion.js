import { request } from 'anteriority-ui/common/api/client';

export const getConfiguracion = () => request('/configuracion');
export const updateConfiguracion = (data) => request('/configuracion', { method: 'PUT', body: data });
