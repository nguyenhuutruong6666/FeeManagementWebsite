import express from 'express';
import { getAllPolicies, createPolicy, updatePolicy, activatePolicy, deactivatePolicy, deletePolicy } from '../controllers/feePolicy.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { createPolicyValidation } from '../validation/fee.validation.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAllPolicies);
router.post('/', createPolicyValidation, createPolicy);
router.put('/:id', updatePolicy);
router.put('/:id/activate', activatePolicy);
router.put('/:id/deactivate', deactivatePolicy);
router.delete('/:id', deletePolicy);

export default router;
