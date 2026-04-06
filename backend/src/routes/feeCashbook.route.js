import express from 'express';
import { getCashbooks } from '../controllers/feeCashbook.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireBCH } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireBCH);

router.get('/', getCashbooks);

export default router;
