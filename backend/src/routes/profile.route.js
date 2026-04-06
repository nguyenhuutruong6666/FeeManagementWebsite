import express from 'express';
import { updateProfile } from '../controllers/profile.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.put('/', updateProfile);

export default router;
