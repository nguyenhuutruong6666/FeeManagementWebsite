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
export const approveDistribution = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const distribution = await prisma.feeDistribution.findUnique({ where: { id } });

        if (!distribution) return sendError(res, 'Không tìm thấy khoản phân bổ', 404);
        if (distribution.status !== 'pending' && distribution.status !== 'transferred') {
            return sendError(res, 'Chỉ có thể duyệt khoản thu đang chờ', 400);
        }

        // Cập nhật trạng thái
        const updated = await prisma.feeDistribution.update({
            where: { id },
            data: { status: 'approved' }
        });

        // Tạo giao dịch thu tiền vào sổ quỹ của đơn vị nhận (transferUnitId)
        if (distribution.transferUnitId && distribution.transferAmount > 0) {
            await prisma.feeCashbook.create({
                data: {
                    unitId: distribution.transferUnitId,
                    transactionType: 'income',
                    transactionCategory: `Thu phí nộp lên từ đơn vị cấp dưới (Kỳ: ${distribution.periodLabel})`,
                    amount: distribution.transferAmount,
                    transactionDate: new Date(),
                    description: `Duyệt khoản trích nộp từ đơn vị ${distribution.unitId}`,
                    recordedBy: req.user.userId
                }
            });
        }

        return sendSuccess(res, updated, 'Đã duyệt khoản thu và ghi nhận vào sổ quỹ!');
    } catch (err) {
        return sendError(res, err.message);
    }
};

export const rejectDistribution = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updated = await prisma.feeDistribution.update({
            where: { id },
            data: { status: 'rejected' }
        });
        return sendSuccess(res, updated, 'Đã từ chối khoản thu!');
    } catch (err) {
        return sendError(res, err.message);
    }
};
