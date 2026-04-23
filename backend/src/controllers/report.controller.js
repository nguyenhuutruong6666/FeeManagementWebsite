import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getReportSummary = async (req, res) => {
  try {
    const { roleName, unitId, isAdmin } = req.user;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    // Xác định các unitId được phép xem
    let allowedUnitIds = null; // null = xem tất cả (admin/BCH Trường)

    if (isAdmin !== 1 && roleName !== 'BCH Trường') {
      if (roleName === 'BCH Khoa') {
        const units = await prisma.unitBrand.findMany({
          where: { OR: [{ id: unitId }, { parentUnitId: unitId }] },
          select: { id: true },
        });
        allowedUnitIds = units.map(u => u.id);
      } else {
        allowedUnitIds = [unitId];
      }
    }

    const userWhere = allowedUnitIds ? { unitId: { in: allowedUnitIds } } : {};

    // Tổng thành viên (Đoàn viên + BCH)
    const totalMembers = await prisma.user.count({
      where: {
        ...userWhere,
        roleName: { in: ['Đoàn viên', 'BCH Chi đoàn', 'BCH Khoa', 'BCH Trường'] },
      },
    });

    // Thành viên đã nộp phí trong năm
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year + 1}-01-01`);

    const paidObligations = await prisma.feeObligation.findMany({
      where: {
        status: 'Đã nộp',
        dueDate: { gte: startOfYear, lt: endOfYear },
        user: userWhere.unitId ? { unitId: userWhere.unitId } : {},
      },
      select: { userId: true },
      distinct: ['userId'],
    });
    const paidMembers = paidObligations.length;
    const unpaidMembers = Math.max(0, totalMembers - paidMembers);

    // Hoạt động
    const activityWhere = allowedUnitIds
      ? { unitId: { in: allowedUnitIds } }
      : {};

    const totalActivities = await prisma.activityProposal.count({ where: activityWhere });
    const approvedActivities = await prisma.activityProposal.count({
      where: { ...activityWhere, status: 'approved' },
    });
    const activeActivities = await prisma.activityProposal.count({
      where: { ...activityWhere, status: 'draft' },
    });

    // Thu chi từ sổ quỹ
    const cashbookWhere = {
      transactionDate: { gte: startOfYear, lt: endOfYear },
      ...(allowedUnitIds ? { unitId: { in: allowedUnitIds } } : {}),
    };

    const incomeAgg = await prisma.feeCashbook.aggregate({
      where: { ...cashbookWhere, transactionType: 'income' },
      _sum: { amount: true },
    });
    const expenseAgg = await prisma.feeCashbook.aggregate({
      where: { ...cashbookWhere, transactionType: 'expense' },
      _sum: { amount: true },
    });

    const totalIncome = Number(incomeAgg._sum.amount || 0);
    const totalExpense = Number(expenseAgg._sum.amount || 0);

    return sendSuccess(res, {
      totalMembers,
      paidMembers,
      unpaidMembers,
      totalActivities,
      approvedActivities,
      activeActivities,
      totalIncome,
      totalExpense,
      year,
    });
  } catch (err) {
    return sendError(res, err.message);
  }
};

