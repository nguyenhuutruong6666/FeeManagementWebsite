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

  return sendSuccess(res, null, 'Phê duyệt thành công!');
};

export const uploadVoucher = async (req, res) => {

  return sendSuccess(res, null, 'Đã tải lên chứng từ.');
};
