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

export const createExpense = async (req, res) => {
    try {
        const { activityId, amount, description } = req.body;
        if (!activityId || !amount) return sendError(res, 'Thiếu thông tin bắt buộc', 400);

        const activity = await prisma.activityProposal.findUnique({ where: { id: parseInt(activityId) } });
        if (!activity) return sendError(res, 'Không tìm thấy hoạt động', 404);

        // Tạo giao dịch chi
        const cashbook = await prisma.feeCashbook.create({
            data: {
                unitId: req.user.unitId,
                transactionType: 'expense',
                transactionCategory: `Chi hoạt động: ${activity.title}`,
                amount: parseFloat(amount),
                transactionDate: new Date(),
                description: description || 'Xuất quỹ giải ngân',
                recordedBy: req.user.userId
            }
        });

        // Cập nhật trạng thái hoạt động thành disbursed
        await prisma.activityProposal.update({
            where: { id: parseInt(activityId) },
            data: { status: 'disbursed' }
        });

        return sendSuccess(res, cashbook, 'Tạo phiếu chi thành công!', 201);
    } catch (err) {
        return sendError(res, err.message);
    }
};
