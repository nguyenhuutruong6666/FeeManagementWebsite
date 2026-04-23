import express from 'express';
import { getDistributions, createDistribution, approveDistribution, rejectDistribution } from '../controllers/feeDistribution.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireBCH } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireBCH);

router.get('/', getDistributions);
router.post('/', createDistribution);
router.put('/:id/approve', approveDistribution);
router.put('/:id/reject', rejectDistribution);

export default router;
