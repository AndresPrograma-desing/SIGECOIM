import { request } from 'anteriority-ui/common/api/client';

export const syncContextHub = () => request('/usuarios/sync-contexthub', { method: 'POST' });
