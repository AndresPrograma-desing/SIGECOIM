import { Router } from 'express';
import { verifyToken, requireTipo } from '../middlewares/authMiddleware.js';
import {
  crearSolicitud,
  getMisSolicitudes,
  getSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
} from '../controllers/solicitudController.js';

const router = Router();

// Estudiante
router.post('/', verifyToken, requireTipo('ESTUDIANTE'), crearSolicitud);
router.get('/mias', verifyToken, requireTipo('ESTUDIANTE'), getMisSolicitudes);

// Staff
router.get('/', verifyToken, requireTipo('STAFF'), getSolicitudes);
router.put('/:id/aprobar', verifyToken, requireTipo('STAFF'), aprobarSolicitud);
router.put('/:id/rechazar', verifyToken, requireTipo('STAFF'), rechazarSolicitud);

export default router;
