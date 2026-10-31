import express from 'express';
import { getUsuarios, createUsuario, toggleEstadoUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';
import { verifyToken, soloEscritura } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken, soloEscritura);

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.put('/:id/toggle', toggleEstadoUsuario);
router.delete('/:id', deleteUsuario);

export default router;
