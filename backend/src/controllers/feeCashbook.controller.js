import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getCashbooks = async (req, res) => {
  try {
    const { roleName, unitId, isAdmin } = req.user;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    let whereClause = {
        transactionDate: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`)
        }
    };

    if (isAdmin !== 1 && roleName !== 'BCH Trường') {
         if (roleName === 'BCH Khoa') {
             const units = await prisma.unitBrand.findMany({
                 where: { OR: [{ id: unitId }, { parentUnitId: unitId }] },
                 select: { id: true }
             });
             whereClause.unitId = { in: units.map(u => u.id) };
         } else if (roleName === 'BCH Chi đoàn') {
             whereClause.unitId = unitId;
         }
    }

    const cashbooks = await prisma.feeCashbook.findMany({
        where: whereClause,
        include: { unitBrand: { include: { unit: true, brand: true } } },
        orderBy: { transactionDate: 'desc' }
    });

    return sendSuccess(res, cashbooks);
  } catch (err) {
    return sendError(res, err.message);
  }
};
