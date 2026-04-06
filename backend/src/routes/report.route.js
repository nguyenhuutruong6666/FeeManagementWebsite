import express from 'express';
import { getReportSummary } from '../controllers/report.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireBCH } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireBCH);

router.get('/summary', getReportSummary);

export default router;
