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
    return sendSuccess(res, null, 'Duyệt kỳ quyết toán thành công.');
};
