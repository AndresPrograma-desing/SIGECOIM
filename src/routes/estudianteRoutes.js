import { Router } from 'express';
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from '../controllers/estudianteController.js';
import { verifyToken, soloEscritura } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', getEstudiantes);
router.post('/', soloEscritura, createEstudiante);
router.put('/:id', soloEscritura, updateEstudiante);
router.delete('/:id', soloEscritura, deleteEstudiante);

export default router;
