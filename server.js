import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import estudianteRoutes from './src/routes/estudianteRoutes.js';
import instrumentoRoutes from './src/routes/instrumentoRoutes.js';
import comodatoRoutes from './src/routes/comodatoRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

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
    
    if (isLocal || isDevTunnel) {
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

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor y base de datos corriendo' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});