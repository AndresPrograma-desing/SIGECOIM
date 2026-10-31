import { Router } from 'express';
import {
  getInstrumentos,
  getInstrumentoById,
  createInstrumento,
  updateInstrumento,
  deleteInstrumento,
  getStockPorTipo,
  getHistorialUbicacion,
} from '../controllers/instrumentoController.js';

import { verifyToken, soloEscritura } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyToken);

// Rutas estáticas primero: deben declararse antes de '/:id' para no colisionar con el parámetro dinámico
router.get('/stock-por-tipo', getStockPorTipo);
router.get('/:id/historial-ubicacion', getHistorialUbicacion);

router.get('/', getInstrumentos);
router.get('/:id', getInstrumentoById);
router.post('/', soloEscritura, createInstrumento);
router.put('/:id', soloEscritura, updateInstrumento);
router.delete('/:id', soloEscritura, deleteInstrumento);

export default router;
