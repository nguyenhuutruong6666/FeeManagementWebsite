import express from 'express';
import { getMyObligations, generateObligations, getUnpaidObligations, remindDebtors } from '../controllers/feeObligation.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin, requireBCH } from '../middlewares/role.middleware.js';
import { generateObligationValidation } from '../validation/fee.validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/my', getMyObligations);
router.post('/generate', requireAdmin, generateObligationValidation, generateObligations);
router.get('/unpaid', requireBCH, getUnpaidObligations);
router.post('/remind', requireBCH, remindDebtors);

export default router;
