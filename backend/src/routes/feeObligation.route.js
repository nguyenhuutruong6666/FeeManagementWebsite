import express from 'express';
import { getMyObligations, generateObligations } from '../controllers/feeObligation.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { generateObligationValidation } from '../validation/fee.validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/my', getMyObligations);
router.post('/generate', requireAdmin, generateObligationValidation, generateObligations);

export default router;
