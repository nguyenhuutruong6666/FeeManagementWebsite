import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, importUsers } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { createUserValidation, updateUserValidation } from '../validation/user.validation.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUserValidation, createUser);
router.put('/:id', updateUserValidation, updateUser);
router.delete('/:id', deleteUser);
router.post('/import', importUsers);

export default router;
