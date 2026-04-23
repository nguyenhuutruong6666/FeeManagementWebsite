import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getApprovals = async (req, res) => {
  try {
    const approvals = await prisma.feeApproval.findMany({
        include: {
            unitBrand: { include: { unit: true, brand: true }},
            approver: { select: { fullName: true }}
        },
        orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, approvals);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const createApproval = async (req, res) => {
  try {
    const { periodLabel, unitId, note } = req.body;

    if (!periodLabel || !unitId) {
      return sendError(res, 'Thiếu thông tin bắt buộc: periodLabel, unitId', 400);
    }

    // Kiểm tra đã duyệt chưa
    const existing = await prisma.feeApproval.findFirst({
      where: { periodLabel, unitId: parseInt(unitId), status: 'approved' }
    });
    if (existing) return sendError(res, `Kỳ ${periodLabel} của đơn vị này đã được duyệt.`, 409);

    const approval = await prisma.feeApproval.create({
      data: {
        periodLabel,
        unitId: parseInt(unitId),
        approvedBy: req.user.userId,
        approvedAt: new Date(),
        status: 'approved',
        note: note || null,
      },
      include: {
        unitBrand: { include: { unit: true, brand: true } },
        approver: { select: { fullName: true } },
      }
    });

    return sendSuccess(res, approval, `Duyệt quyết toán kỳ ${periodLabel} thành công!`, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

