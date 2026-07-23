import { Router } from 'express';
import {
  getComodatos,
  createComodato,
  registrarDevolucion,
  updateComodato,
  deleteComodato
} from '../controllers/comodatoController.js';

const router = Router();

router.get('/', getComodatos);
router.post('/', createComodato);
router.put('/:id', updateComodato);
router.post('/:id/devolucion', registrarDevolucion);
router.delete('/:id', deleteComodato);

export default router;
