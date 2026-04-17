import express from 'express';
import { login, getMe, changePassword, forgotPassword, sendOtp, checkOtp, verifyOtpAndReset } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { loginValidation, changePasswordValidation, forgotPasswordValidation, sendOtpValidation, checkOtpValidation, verifyOtpValidation } from '../validation/auth.validation.js';

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/send-otp', sendOtpValidation, sendOtp);
router.post('/check-otp', checkOtpValidation, checkOtp);
router.post('/verify-otp-reset', verifyOtpValidation, verifyOtpAndReset);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePasswordValidation, changePassword);

export default router;
