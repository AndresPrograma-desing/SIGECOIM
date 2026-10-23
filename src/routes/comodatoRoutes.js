import { Router } from 'express';
import {
  getComodatos,
  createComodato,
  registrarDevolucion,
  updateComodato,
  deleteComodato,
  getRepresentantesPorVencer
} from '../controllers/comodatoController.js';

const router = Router();

router.get('/alertas/por-vencer', getRepresentantesPorVencer);

router.get('/', getComodatos);
router.post('/', createComodato);
router.put('/:id', updateComodato);
router.post('/:id/devolucion', registrarDevolucion);
router.delete('/:id', deleteComodato);

export default router;
