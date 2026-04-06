import express from 'express';
import { createPayment, confirmCashPayment, vnpayIpn } from '../controllers/feePayment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireBCH } from '../middlewares/role.middleware.js';
import { paymentValidation } from '../validation/fee.validation.js';

const router = express.Router();

// Webhook for VNPay does not require authentication
router.post('/vnpay-ipn', vnpayIpn);

router.use(authenticate);

router.post('/', paymentValidation, createPayment);
router.post('/confirm-cash', requireBCH, confirmCashPayment);

export default router;
