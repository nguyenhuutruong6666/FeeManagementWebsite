import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateTransactionCode, generateReceiptCode } from '../utils/formatters.js';

export const createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { obligationId, method, amount } = req.body;
  const payerId = req.user.userId;

  try {
    const obligation = await prisma.feeObligation.findUnique({ where: { id: obligationId } });
    if (!obligation || obligation.status === 'Đã nộp') {
       return sendError(res, 'Nghĩa vụ không tồn tại hoặc đã được nộp.', 400);
    }

    const transactionCode = generateTransactionCode();
    
    const payment = await prisma.feePayment.create({
      data: {
        obligationId,
        payerId,
        paymentMethod: method,
        amount: parseFloat(amount),
        transactionCode,
        status: method === 'Cash' ? 'Pending' : 'VNPAY_Pending',
        collectorId: (req.user.isAdmin === 1 || ['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'].includes(req.user.roleName)) ? req.user.userId : null
      }
    });

    if (method === 'Cash') {
      if (payment.collectorId) {

        await confirmCashPaymentLogic(payment.id, payment.collectorId);
        return sendSuccess(res, payment, 'Nộp tiền mặt thành công (Được BCH xác nhận tự động).');
      }
      return sendSuccess(res, payment, 'Đã ghi nhận nộp tiền mặt. Đang chờ BCH Chi đoàn xác nhận.');
    } else if (method === 'VNPAY') {

      const paymentUrl = `${process.env.VNPAY_URL}?vnp_TxnRef=${transactionCode}&vnp_Amount=${amount*100}`;
      return sendSuccess(res, { paymentUrl }, 'Chuyển hướng đến VNPay...');
    }

  } catch (err) {
    return sendError(res, err.message);
  }
};

const confirmCashPaymentLogic = async (paymentId, collectorId) => {
    const payment = await prisma.feePayment.findUnique({ where: { id: paymentId } });
    
    await prisma.feePayment.update({
        where: { id: paymentId },
        data: { status: 'Success', paymentDate: new Date(), collectorId }
    });
    
    await prisma.feeObligation.update({
        where: { id: payment.obligationId },
        data: { status: 'Đã nộp' }
    });

    const receiptCode = generateReceiptCode(paymentId);
    
    const receipt = await prisma.feeReceipt.create({
        data: {
            paymentId,
            receiptCode,
            issuedBy: collectorId,
            amount: payment.amount
        }
    });

    await prisma.feePayment.update({
        where: { id: paymentId },
        data: { receiptId: receipt.id }
    });
};

export const confirmCashPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;
        await confirmCashPaymentLogic(paymentId, req.user.userId);
        return sendSuccess(res, null, 'Đã xác nhận thanh toán tiền mặt.');
    } catch(err) {
        return sendError(res, err.message);
    }
};

export const getAllPayments = async (req, res) => {
  try {
    const { roleName, unitId, isAdmin } = req.user;
    const { status, method, search } = req.query;

    let whereClause = {};

    // Filter by status
    if (status) whereClause.status = status;
    // Filter by method
    if (method) whereClause.paymentMethod = method;
    // Filter by search (transaction code)
    if (search) {
      whereClause.transactionCode = { contains: search, mode: 'insensitive' };
    }

    // Scope by role
    if (isAdmin !== 1 && roleName !== 'BCH Trường') {
      if (roleName === 'BCH Khoa') {
        const units = await prisma.unitBrand.findMany({
          where: { OR: [{ id: unitId }, { parentUnitId: unitId }] },
          select: { id: true },
        });
        const unitIds = units.map(u => u.id);
        whereClause.payer = { unitId: { in: unitIds } };
      } else if (roleName === 'BCH Chi đoàn') {
        whereClause.payer = { unitId };
      }
    }

    const payments = await prisma.feePayment.findMany({
      where: whereClause,
      include: {
        payer: { select: { fullName: true, unitBrand: { include: { unit: true, brand: true } } } },
        collector: { select: { fullName: true } },
        obligation: { include: { policy: { select: { policyName: true, cycle: true } } } },
        receipt: { select: { receiptCode: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, payments);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const vnpayIpn = async (req, res) => {
    return sendSuccess(res, null, 'Ghi nhận IPN.');
};

export const rejectCashPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;
        const payment = await prisma.feePayment.findUnique({ where: { id: paymentId } });

        if (!payment || payment.status !== 'Pending' || payment.paymentMethod !== 'Cash') {
            return sendError(res, 'Giao dịch không hợp lệ hoặc đã được xử lý.', 400);
        }

        // Đổi trạng thái giao dịch nộp phí thành Failed
        await prisma.feePayment.update({
            where: { id: paymentId },
            data: { status: 'Failed' }
        });

        // Không cập nhật FeeObligation, giữ nguyên trạng thái "Chưa nộp" để người dùng nộp lại

        return sendSuccess(res, null, 'Đã từ chối khoản nộp tiền mặt. Đoàn viên có thể nộp lại.');
    } catch(err) {
        return sendError(res, err.message);
    }
};
