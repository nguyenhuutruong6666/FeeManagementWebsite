import express from 'express';
import { getActivities, createActivity, approveActivity, rejectActivity, uploadVoucher } from '../controllers/activity.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createActivityValidation } from '../validation/activity.validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getActivities);
router.post('/', createActivityValidation, createActivity);
router.put('/:id/approve', approveActivity);
router.put('/:id/reject', rejectActivity);
router.post('/:id/voucher', uploadVoucher);

export default router;
