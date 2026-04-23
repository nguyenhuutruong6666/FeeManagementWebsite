import express from 'express';
import { createPayment, confirmCashPayment, rejectCashPayment, vnpayIpn, getAllPayments } from '../controllers/feePayment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireBCH } from '../middlewares/role.middleware.js';
import { paymentValidation } from '../validation/fee.validation.js';

const router = express.Router();


router.post('/vnpay-ipn', vnpayIpn);

router.use(authenticate);

router.get('/', getAllPayments);
router.post('/', paymentValidation, createPayment);
router.post('/confirm-cash', requireBCH, confirmCashPayment);
router.post('/reject-cash', requireBCH, rejectCashPayment);

export default router;
