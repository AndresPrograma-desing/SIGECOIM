import { Router } from 'express';
import {
  getInstrumentos,
  getInstrumentoById,
  createInstrumento,
  updateInstrumento,
  deleteInstrumento,
} from '../controllers/instrumentoController.js';

const router = Router();

router.get('/', getInstrumentos);
router.get('/:id', getInstrumentoById);
router.post('/', createInstrumento);
router.put('/:id', updateInstrumento);
router.delete('/:id', deleteInstrumento);

export default router;
