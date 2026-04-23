import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getActivities = async (req, res) => {
  try {
    const { roleName, unitId, isAdmin } = req.user;
    let whereClause = {};

    if (isAdmin !== 1 && roleName !== 'BCH Trường') {
      if (roleName === 'BCH Khoa') {
        const units = await prisma.unitBrand.findMany({
          where: { OR: [{ id: unitId }, { parentUnitId: unitId }] },
          select: { id: true }
        });
        whereClause.unitId = { in: units.map(u => u.id) };
      } else {
        whereClause.unitId = unitId;
      }
    }

    const activities = await prisma.activityProposal.findMany({
      where: whereClause,
      include: { proposer: { select: { fullName: true } }, unitBrand: { include: { unit: true, brand: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, activities);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const createActivity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { title, content, estimatedBudget, expectedDate, unitId } = req.body;

  try {
    const activity = await prisma.activityProposal.create({
      data: {
        title, content, expectedDate: new Date(expectedDate),
        estimatedBudget: parseFloat(estimatedBudget),
        proposerId: req.user.userId,
        unitId: parseInt(unitId),
        status: 'draft'
      }
    });
    return sendSuccess(res, activity, 'Đề xuất hoạt động thành công!', 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const approveActivity = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const activity = await prisma.activityProposal.findUnique({ where: { id } });

        if (!activity) return sendError(res, 'Không tìm thấy đề xuất', 404);
        if (activity.status !== 'draft') return sendError(res, 'Chỉ duyệt đề xuất đang chờ', 400);

        const updated = await prisma.activityProposal.update({
            where: { id },
            data: { 
                status: 'approved',
                approvedBy: req.user.userId,
                approvedAt: new Date(),
                approvedBudget: activity.estimatedBudget // Giả định duyệt toàn bộ kinh phí dự kiến
            }
        });

        return sendSuccess(res, updated, 'Phê duyệt thành công!');
    } catch (err) {
        return sendError(res, err.message);
    }
};

export const rejectActivity = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { rejectionReason } = req.body;

        const updated = await prisma.activityProposal.update({
            where: { id },
            data: { 
                status: 'rejected',
                approvedBy: req.user.userId,
                approvedAt: new Date(),
                rejectionReason: rejectionReason || 'Không hợp lệ'
            }
        });

        return sendSuccess(res, updated, 'Đã từ chối đề xuất!');
    } catch (err) {
        return sendError(res, err.message);
    }
};

export const uploadVoucher = async (req, res) => {

  return sendSuccess(res, null, 'Đã tải lên chứng từ.');
};
