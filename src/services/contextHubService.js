const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zykiszdsznbnuidzzome.supabase.co';
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const CLIENT_SECRET = process.env.CONTEXTHUB_CLIENT_SECRET;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'x-sdk-client-secret': CLIENT_SECRET,
});

/**
 * Lista los usuarios vinculados a la integración en ContextHub
 */
export const listContextHubUsers = async (search = '') => {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/sdk-provider-users?action=list`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ search }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error listando usuarios en ContextHub:', err);
    return { ok: false, error: err.message };
  }
};

/**
 * Crea un usuario en ContextHub vinculado a esta integración
 */
export const createContextHubUser = async (email, password) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/sdk-provider-users?action=create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error creando usuario en ContextHub:', err);
    return { ok: false, error: err.message };
  }
};

/**
 * Edita un usuario en ContextHub (email y/o password)
 */
export const editContextHubUser = async (userId, { email, password }) => {
  try {
    const body = { userId };
    if (email) body.email = email;
    if (password) body.password = password;

    const res = await fetch(`${SUPABASE_URL}/functions/v1/sdk-provider-users?action=edit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error('Error editando usuario en ContextHub:', err);
    return { ok: false, error: err.message };
  }
};

/**
 * Elimina un usuario en ContextHub
 */
export const deleteContextHubUser = async (userId) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/sdk-provider-users?action=delete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error eliminando usuario en ContextHub:', err);
    return { ok: false, error: err.message };
  }
};
