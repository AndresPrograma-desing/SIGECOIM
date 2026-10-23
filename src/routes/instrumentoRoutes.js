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

const router = Router();

// Rutas estáticas primero: deben declararse antes de '/:id' para no colisionar con el parámetro dinámico
router.get('/stock-por-tipo', getStockPorTipo);
router.get('/:id/historial-ubicacion', getHistorialUbicacion);

router.get('/', getInstrumentos);
router.get('/:id', getInstrumentoById);
router.post('/', createInstrumento);
router.put('/:id', updateInstrumento);
router.delete('/:id', deleteInstrumento);

export default router;
