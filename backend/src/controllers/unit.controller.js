import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAllUnits = async (req, res) => {
  try {
    const units = await prisma.unit.findMany({ orderBy: { id: 'asc' } });
    return sendSuccess(res, units);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const createUnit = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return sendError(res, 'Tên đơn vị không được để trống', 400);
    const unit = await prisma.unit.create({ data: { title } });
    return sendSuccess(res, unit, 'Tạo đơn vị thành công!');
  } catch (err) {
    return sendError(res, err.message);
  }
};

// Also unit_brand fetching for the UI
export const getUnitBrands = async (req, res) => {
    try {
        const unitBrands = await prisma.unitBrand.findMany({
            include: { unit: true, brand: true },
            orderBy: [{ brandId: 'asc' }, { unit: { title: 'asc' } }]
        });
        return sendSuccess(res, unitBrands);
    } catch(err) {
        return sendError(res, err.message);
    }
};

export const createUnitBrand = async (req, res) => {
    try {
        const { unitTitle, brandId, parentUnitId } = req.body;
        if (!unitTitle || !brandId) return sendError(res, 'Thiếu thông tin bắt buộc', 400);

        // 1. Create Unit first
        const unit = await prisma.unit.create({ data: { title: unitTitle } });
        
        // 2. Create UnitBrand
        const ub = await prisma.unitBrand.create({
            data: {
                unitId: unit.id,
                brandId: parseInt(brandId),
                parentUnitId: parentUnitId ? parseInt(parentUnitId) : null
            },
            include: { unit: true, brand: true }
        });
        
        return sendSuccess(res, ub, 'Tạo tổ chức thành công');
    } catch(err) {
        return sendError(res, err.message);
    }
};
