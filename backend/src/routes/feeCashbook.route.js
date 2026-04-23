import express from 'express';
import { getCashbooks, createExpense } from '../controllers/feeCashbook.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireBCH } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireBCH);

router.get('/', getCashbooks);
router.post('/expense', createExpense);

export default router;
