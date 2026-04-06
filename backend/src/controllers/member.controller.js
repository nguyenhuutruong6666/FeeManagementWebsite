import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getMembers = async (req, res) => {
  try {
    const { roleName, unitId, isAdmin } = req.user;
    const { filter_role, filter_unit } = req.query;

    let whereClause = {};

    // Base filtering from query params
    if (filter_role) {
      whereClause.roleName = filter_role;
    }
    if (filter_unit) {
      whereClause.unitId = parseInt(filter_unit);
    }

    // Role-based visibility
    if (isAdmin !== 1 && roleName !== 'BCH Trường') {
      if (roleName === 'BCH Khoa') {
        const units = await prisma.unitBrand.findMany({
          where: { OR: [{ id: unitId }, { parentUnitId: unitId }] },
          select: { id: true },
        });
        const allowedUnitIds = units.map(u => u.id);
        whereClause.unitId = { in: allowedUnitIds };
        
        // If filter_unit is provided, ensure it's within allowed units
        if (filter_unit && !allowedUnitIds.includes(parseInt(filter_unit))) {
             return sendSuccess(res, []); // Return empty if filtering outside allowed scope
        }
      } else if (roleName === 'BCH Chi đoàn') {
        whereClause.unitId = unitId;
        if (filter_unit && parseInt(filter_unit) !== unitId) {
             return sendSuccess(res, []);
        }
      } else {
        // Đoàn viên can only see members of their own unit? The PHP code didn't allow access for them, but just in case:
        return sendError(res, 'Không có quyền truy cập', 403);
      }
    }

    const members = await prisma.user.findMany({
      where: whereClause,
      include: {
        unitBrand: {
          include: { unit: true, brand: true },
        },
      },
      orderBy: { userId: 'asc' },
    });

    const result = members.map(({ password, ...u }) => u);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err.message);
  }
};
