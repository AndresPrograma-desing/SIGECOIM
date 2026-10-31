import { Router } from 'express';
import {
  getComodatos,
  createComodato,
  registrarDevolucion,
  updateComodato,
  deleteComodato,
  getRepresentantesPorVencer
} from '../controllers/comodatoController.js';

import { verifyToken, soloEscritura } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/alertas/por-vencer', getRepresentantesPorVencer);

router.get('/', getComodatos);
router.post('/', soloEscritura, createComodato);
router.put('/:id', soloEscritura, updateComodato);
router.post('/:id/devolucion', soloEscritura, registrarDevolucion);
router.delete('/:id', soloEscritura, deleteComodato);

export default router;
