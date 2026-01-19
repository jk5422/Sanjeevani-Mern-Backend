import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../middleware/validate';
import { loginSchema, registerSchema } from '../validators/auth.schema';

const router = Router();

// Routes
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/register', validate(registerSchema), AuthController.register);

export default router;
