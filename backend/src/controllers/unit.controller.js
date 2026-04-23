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

        const unit = await prisma.unit.create({ data: { title: unitTitle } });
        
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

export const getUnitBrandById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const ub = await prisma.unitBrand.findUnique({
            where: { id },
            include: { unit: true, brand: true }
        });
        if (!ub) return sendError(res, 'Không tìm thấy tổ chức', 404);
        return sendSuccess(res, ub);
    } catch (err) {
        return sendError(res, err.message);
    }
};

export const updateUnitBrand = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title } = req.body;
        
        if (!title) return sendError(res, 'Tên đơn vị không được để trống', 400);

        const ub = await prisma.unitBrand.findUnique({ where: { id } });
        if (!ub) return sendError(res, 'Không tìm thấy tổ chức', 404);

        const updatedUnit = await prisma.unit.update({
            where: { id: ub.unitId },
            data: { title }
        });

        return sendSuccess(res, updatedUnit, 'Cập nhật tên tổ chức thành công!');
    } catch (err) {
        return sendError(res, err.message);
    }
};

export const deleteUnitBrand = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const target = await prisma.unitBrand.findUnique({ where: { id } });
        if (!target) return sendError(res, 'Không tìm thấy tổ chức', 404);

        let ubIdsToDelete = [id];
        let unitIdsToDelete = [target.unitId];

        const level1 = await prisma.unitBrand.findMany({ where: { parentUnitId: id } });
        for (const child of level1) {
            ubIdsToDelete.push(child.id);
            unitIdsToDelete.push(child.unitId);

            const level2 = await prisma.unitBrand.findMany({ where: { parentUnitId: child.id } });
            for (const grandChild of level2) {
                ubIdsToDelete.push(grandChild.id);
                unitIdsToDelete.push(grandChild.unitId);
            }
        }

        await prisma.$transaction([
            prisma.unitBrand.deleteMany({ where: { id: { in: ubIdsToDelete } } }),
            prisma.unit.deleteMany({ where: { id: { in: unitIdsToDelete } } })
        ]);

        return sendSuccess(res, null, 'Xóa tổ chức thành công!');
    } catch (err) {
        if (err.code === 'P2003') {
            return sendError(res, 'Không thể xóa tổ chức này vì đã có dữ liệu (người dùng, hoạt động, báo cáo) liên kết tại tổ chức này hoặc tổ chức cấp dưới.', 400);
        }
        return sendError(res, err.message);
    }
};
