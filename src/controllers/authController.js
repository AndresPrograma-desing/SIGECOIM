import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'El correo y la contraseña son requeridos' });
    }

    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(403).json({ error: 'El usuario se encuentra desactivado' });
    }

    // Verificar la contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Crear el token JWT
    const secret = process.env.JWT_SECRET || 'sigecoim_default_jwt_secret_key_2026';
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      secret,
      { expiresIn: '8h' }
    );

    // Retornar los datos del usuario y el token
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor al autenticar' });
  }
};

export const sdkLogin = async (req, res) => {
  try {
    const { ticket } = req.body;

    if (!ticket) {
      return res.status(400).json({ error: 'El ticket de autenticación es requerido' });
    }

    const supabaseUrl = process.env.SUPABASE_URL || 'https://zykiszdsznbnuidzzome.supabase.co';
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const clientSecret = process.env.CONTEXTHUB_CLIENT_SECRET;

    if (!clientSecret) {
      return res.status(500).json({ error: 'Falta configurar CONTEXTHUB_CLIENT_SECRET en el backend' });
    }

    const verifyResponse = await fetch(`${supabaseUrl}/functions/v1/sdk-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'x-sdk-client-secret': clientSecret,
      },
      body: JSON.stringify({ ticket }),
    });

    const verifyData = await verifyResponse.json().catch(() => ({}));

    if (!verifyResponse.ok || !verifyData.ok || !verifyData.user?.email) {
      const errorMsg = verifyData.error === 'invalid_token'
        ? 'El ticket de sesión es inválido o ha expirado. Por favor, intenta nuevamente.'
        : (verifyData.error || 'No se pudo verificar la sesión con ContextHub');
      return res.status(401).json({ error: errorMsg });
    }

    const userEmail = verifyData.user.email.toLowerCase().trim();

    // Buscar o registrar al usuario en SIGECOIM
    let usuario = await Usuario.findOne({ where: { email: userEmail } });

    if (!usuario) {
      const randomPassword = crypto.randomUUID();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const defaultRol = userEmail === 'admin@sigecoim.com' ? 'ANALISTA_BIENES' : 'COORDINADOR';
      const defaultName = userEmail.split('@')[0];

      usuario = await Usuario.create({
        nombre: defaultName,
        email: userEmail,
        password: hashedPassword,
        rol: defaultRol,
        estado: true,
      });
    }

    if (!usuario.estado) {
      return res.status(403).json({ error: 'El usuario se encuentra desactivado en SIGECOIM' });
    }

    // Crear el token JWT de SIGECOIM
    const secret = process.env.JWT_SECRET || 'sigecoim_default_jwt_secret_key_2026';
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      secret,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en sdkLogin:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la autenticación de ContextHub' });
  }
};

