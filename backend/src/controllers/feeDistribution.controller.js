import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getDistributions = async (req, res) => {
  try {
    const distributions = await prisma.feeDistribution.findMany({
        include: {
            unitBrand: { include: { unit: true, brand: true }},
            transferUnit: { include: { unit: true, brand: true }}
        },
        orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, distributions);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const createDistribution = async (req, res) => {
  try {
    const { periodLabel, unitId, totalAmount, ratioChiDoan = 60, ratioKhoa = 30, ratioTruong = 10, transferUnitId, transferAmount } = req.body;

    if (!periodLabel || !unitId || !totalAmount) {
      return sendError(res, 'Thiếu thông tin bắt buộc: periodLabel, unitId, totalAmount', 400);
    }

    const total = parseFloat(totalAmount);
    const amountChiDoan = (total * ratioChiDoan) / 100;
    const amountKhoa = (total * ratioKhoa) / 100;
    const amountTruong = (total * ratioTruong) / 100;

    const ratioJson = JSON.stringify({ chiDoan: ratioChiDoan, khoa: ratioKhoa, truong: ratioTruong });

    const distribution = await prisma.feeDistribution.create({
      data: {
        periodLabel,
        unitId: parseInt(unitId),
        totalAmount: total,
        amountChiDoan,
        amountKhoa,
        amountTruong,
        ratioJson,
        transferUnitId: transferUnitId ? parseInt(transferUnitId) : null,
        transferAmount: transferAmount ? parseFloat(transferAmount) : 0,
        transferDate: transferUnitId ? new Date() : null,
        status: transferUnitId ? 'transferred' : 'pending',
        createdBy: req.user.userId,
      },
      include: {
        unitBrand: { include: { unit: true, brand: true } },
        transferUnit: { include: { unit: true, brand: true } },
      }
    });

    return sendSuccess(res, distribution, 'Phân bổ đoàn phí thành công!', 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

