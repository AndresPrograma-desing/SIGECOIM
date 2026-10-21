import express from 'express';
import { getUsuarios, createUsuario, toggleEstadoUsuario, updateUsuario, deleteUsuario, syncContextHubUsers } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.post('/sync-contexthub', syncContextHubUsers);
router.put('/:id', updateUsuario);
router.put('/:id/toggle', toggleEstadoUsuario);
router.delete('/:id', deleteUsuario);

export default router;
