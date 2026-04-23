import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateReferenceCode } from '../utils/formatters.js';
import { sendRemindEmail } from '../utils/mailer.js';

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

export const getUnpaidObligations = async (req, res) => {
  try {
    const { unitId, roleName, isAdmin } = req.user;
    let whereClause = { status: 'Chưa nộp' };

    if (isAdmin !== 1 && roleName !== 'BCH Trường') {
        if (roleName === 'BCH Khoa') {
             const units = await prisma.unitBrand.findMany({
                  where: { OR: [{ id: unitId }, { parentUnitId: unitId }] },
                  select: { id: true }
             });
             whereClause.user = { unitId: { in: units.map(u => u.id) } };
        } else if (roleName === 'BCH Chi đoàn') {
             whereClause.user = { unitId: unitId };
        }
    }

    const obligations = await prisma.feeObligation.findMany({
      where: whereClause,
      include: {
        user: { select: { fullName: true, email: true, unitBrand: { include: { unit: true, brand: true } } } },
        policy: true
      },
      orderBy: { dueDate: 'asc' },
    });
    return sendSuccess(res, obligations);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const remindDebtors = async (req, res) => {
    try {
        const { obligationIds } = req.body; 
        if (!obligationIds || !Array.isArray(obligationIds)) {
            return sendError(res, 'Danh sách nghĩa vụ không hợp lệ', 400);
        }

        const obligations = await prisma.feeObligation.findMany({
            where: { id: { in: obligationIds } },
            include: { user: true, policy: true }
        });

        let successCount = 0;
        for (const obl of obligations) {
            if (obl.user?.email) {
                try {
                    await sendRemindEmail(
                        obl.user.email,
                        obl.user.fullName,
                        obl.periodLabel,
                        obl.amount,
                        obl.dueDate
                    );
                    successCount++;
                } catch (emailErr) {
                    console.error(`Lỗi gửi email cho ${obl.user.email}:`, emailErr);
                }
            }
        }

        return sendSuccess(res, { successCount }, `Đã gửi nhắc nợ thành công cho ${successCount} đoàn viên.`);
    } catch (err) {
        return sendError(res, err.message);
    }
};
