import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAllPolicies = async (req, res) => {
  try {
    const policies = await prisma.feePolicy.findMany({
      include: { creator: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, policies);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const createPolicy = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { policyName, cycle, dueDate, standardAmount, rulesJson } = req.body;
  try {
    const policy = await prisma.feePolicy.create({
      data: {
        policyName, cycle, dueDate: new Date(dueDate),
        standardAmount: parseFloat(standardAmount),
        rulesJson: rulesJson ? JSON.stringify(rulesJson) : null,
        status: 'draft',
        createdBy: req.user.userId,
      },
    });
    return sendSuccess(res, policy, 'Tạo chính sách phí thành công!', 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const updatePolicy = async (req, res) => {
  // ... similar logic for updating
};

export const activatePolicy = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if another policy is active
    const activePolicy = await prisma.feePolicy.findFirst({ where: { status: 'Active' } });
    if (activePolicy && activePolicy.id !== id) {
      return sendError(res, 'Hiện đã có một chính sách đang hoạt động. Hãy hủy kích hoạt chính sách hiện tại trước.', 400);
    }

    const updated = await prisma.feePolicy.update({
      where: { id },
      data: { status: 'Active' }
    });
    return sendSuccess(res, updated, 'Kích hoạt chính sách thành công!');
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const deactivatePolicy = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await prisma.feePolicy.update({
      where: { id },
      data: { status: 'Draft' }
    });
    return sendSuccess(res, updated, 'Đã chuyển chính sách về Nháp!');
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const deletePolicy = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const policy = await prisma.feePolicy.findUnique({ where: { id }});
        if(!policy) return sendError(res, 'Chính sách không tồn tại', 404);
        if(policy.status === 'Active') return sendError(res, 'Không thể xóa chính sách đang hoạt động', 400);

        await prisma.feePolicy.delete({ where: { id } });
        return sendSuccess(res, null, 'Đã xóa chính sách thành công!');
    } catch(err) {
        return sendError(res, err.message);
    }
}
