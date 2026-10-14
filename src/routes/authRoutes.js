import { Router } from 'express';
import { login, sdkLogin } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/sdk-login', sdkLogin);

export default router;
