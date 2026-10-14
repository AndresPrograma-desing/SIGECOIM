import { request } from 'anteriority-ui/common/api/client';

export const getEstudiantes = () => request('/estudiantes');
export const createEstudiante = (data) => request('/estudiantes', { method: 'POST', body: data });
export const updateEstudiante = (id, data) => request(`/estudiantes/${id}`, { method: 'PUT', body: data });
export const deleteEstudiante = (id) => request(`/estudiantes/${id}`, { method: 'DELETE' });
