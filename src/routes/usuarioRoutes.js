import express from 'express';
import { getUsuarios, createUsuario, toggleEstadoUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.put('/:id/toggle', toggleEstadoUsuario);
router.delete('/:id', deleteUsuario);

export default router;
