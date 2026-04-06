import express from 'express';
import { getApprovals, createApproval } from '../controllers/feeApproval.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireBCH } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireBCH);

router.get('/', getApprovals);
router.post('/', createApproval);

export default router;
