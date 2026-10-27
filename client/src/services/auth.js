import { request } from 'anteriority-ui/common/api/client';

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password }, auth: false });

