import express from 'express';
import { login, getMe, changePassword, forgotPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { loginValidation, changePasswordValidation, forgotPasswordValidation } from '../validation/auth.validation.js';

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePasswordValidation, changePassword);

export default router;
