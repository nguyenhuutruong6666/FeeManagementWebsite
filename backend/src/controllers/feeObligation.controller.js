import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateReferenceCode } from '../utils/formatters.js';

export const getMyObligations = async (req, res) => {
  try {
    const obligations = await prisma.feeObligation.findMany({
      where: { userId: req.user.userId, status: 'Chưa nộp' },
      include: { policy: true },
      orderBy: { dueDate: 'asc' },
    });
    return sendSuccess(res, obligations);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const generateObligations = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { policyId, periodLabel } = req.body;
  
  try {
    const policy = await prisma.feePolicy.findUnique({ where: { id: policyId } });
    if (!policy) return sendError(res, 'Chính sách không tồn tại', 404);

    const users = await prisma.user.findMany({
      where: { roleName: { in: ['Đoàn viên', 'BCH Chi đoàn', 'BCH Khoa', 'BCH Trường'] } }
    });

    let success = 0;
    let failed = 0;

    for (const u of users) {
      try {
        const refCode = generateReferenceCode(u.identifyCard || u.userId, periodLabel);
        await prisma.feeObligation.create({
          data: {
            userId: u.userId,
            policyId: policy.id,
            periodLabel,
            amount: policy.standardAmount,
            dueDate: policy.dueDate,
            status: 'Chưa nộp',
            referenceCode: refCode
          }
        });
        success++;
      } catch (err) {
        failed++;
      }
    }

    await prisma.feeGenerationLog.create({
      data: {
        policyId: policy.id,
        runBy: req.user.userId,
        cycleLabel: periodLabel,
        totalSuccess: success,
        totalFailed: failed,
        runTime: new Date()
      }
    });

    return sendSuccess(res, { success, failed }, `Đã sinh nghĩa vụ. Thành công: ${success}, Thất bại: ${failed}`);
  } catch (err) {
    return sendError(res, err.message);
  }
};
