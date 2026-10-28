import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import estudianteRoutes from './src/routes/estudianteRoutes.js';
import instrumentoRoutes from './src/routes/instrumentoRoutes.js';
import comodatoRoutes from './src/routes/comodatoRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import solicitudRoutes from './src/routes/solicitudRoutes.js';
import configuracionRoutes from './src/routes/configuracionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Dominio(s) de producción del frontend (ej. https://sigecoim.vercel.app), separados
// por coma si hay más de uno. Se configura en el .env del backend (Render, etc.).
const FRONTEND_URLS = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como scripts locales, apps móviles, curl, etc.)
    if (!origin) return callback(null, true);

    const isLocal = origin.includes('localhost') ||
                    origin.includes('127.0.0.1') ||
                    /^http:\/\/192\.168\.\d+\.\d+/.test(origin) ||
                    /^http:\/\/10\.\d+\.\d+\.\d+/.test(origin); // Rango de red local 10.x.x.x

    const isDevTunnel = origin.includes('devtunnels.ms');

    // Previews de Vercel (ej. sigecoim-git-feature-usuario.vercel.app) y el dominio
    // de producción, además de cualquiera indicado explícitamente en FRONTEND_URL.
    const isVercel = /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
    const isAllowedFrontend = FRONTEND_URLS.includes(origin);

    if (isLocal || isDevTunnel || isVercel || isAllowedFrontend) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido para este origen por seguridad'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Probar conexión a la DB
connectDB();

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/instrumentos', instrumentoRoutes);
app.use('/api/comodatos', comodatoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/configuracion', configuracionRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor y base de datos corriendo' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});