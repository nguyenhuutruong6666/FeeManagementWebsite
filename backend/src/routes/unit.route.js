import express from 'express';
import { getAllUnits, createUnit, getUnitBrands, createUnitBrand, getUnitBrandById, updateUnitBrand, deleteUnitBrand } from '../controllers/unit.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/brands', getUnitBrands);

router.use(requireAdmin);
router.get('/', getAllUnits);
router.post('/', createUnit);

router.post('/brands', createUnitBrand);
router.get('/brands/:id', getUnitBrandById);
router.put('/brands/:id', updateUnitBrand);
router.delete('/brands/:id', deleteUnitBrand);

export default router;
