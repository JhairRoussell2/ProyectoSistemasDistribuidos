import { Router } from 'express';
import { register, login ,recuperarContraseña, resetPassword} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post("/recuperar", recuperarContraseña);
router.post("/reset/:token", resetPassword);
export default router;
