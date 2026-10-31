import { Router } from 'express';
import { getConfiguracion, updateConfiguracion } from '../controllers/configuracionController.js';

import { verifyToken, soloEscritura } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getConfiguracion);
router.put('/', verifyToken, soloEscritura, updateConfiguracion);

export default router;
