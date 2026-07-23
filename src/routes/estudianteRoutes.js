import { Router } from 'express';
import { getEstudiantes } from '../controllers/estudianteController.js';

const router = Router();

router.get('/', getEstudiantes);

export default router;
