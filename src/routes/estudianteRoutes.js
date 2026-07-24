import { Router } from 'express';
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from '../controllers/estudianteController.js';

const router = Router();

router.get('/', getEstudiantes);
router.post('/', createEstudiante);
router.put('/:id', updateEstudiante);
router.delete('/:id', deleteEstudiante);

export default router;
