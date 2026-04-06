import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

const userInclude = {
  unitBrand: {
    include: { unit: true, brand: true },
  },
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: userInclude,
      orderBy: { userId: 'asc' },
    });
    const result = users.map(({ password, ...u }) => u);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(req.params.id) },
      include: userInclude,
    });
    if (!user) return sendError(res, 'Người dùng không tồn tại.', 404);
    const { password, ...result } = user;
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { userName, fullName, email, password, gender, identifyCard, birthDate, joinDate, roleName, isAdmin, unitId } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        userName, fullName, email, password: hashed,
        gender: gender !== undefined ? parseInt(gender) : null,
        identifyCard, roleName,
        isAdmin: isAdmin ? 1 : 0,
        unitId: unitId ? parseInt(unitId) : null,
        birthDate: birthDate ? new Date(birthDate) : null,
        joinDate: joinDate ? new Date(joinDate) : null,
      },
      include: userInclude,
    });
    const { password: _, ...result } = user;
    return sendSuccess(res, result, 'Tạo người dùng thành công!', 201);
  } catch (err) {
    if (err.code === 'P2002') return sendError(res, 'Tên đăng nhập hoặc email đã tồn tại.', 409);
    return sendError(res, err.message);
  }
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const userId = parseInt(req.params.id);
  const { fullName, email, gender, identifyCard, birthDate, joinDate, roleName, isAdmin, unitId, password } = req.body;
  try {
    const data = {
      fullName, email,
      gender: gender !== undefined ? parseInt(gender) : null,
      identifyCard, roleName,
      isAdmin: isAdmin ? 1 : 0,
      unitId: unitId ? parseInt(unitId) : null,
      birthDate: birthDate ? new Date(birthDate) : null,
      joinDate: joinDate ? new Date(joinDate) : null,
    };
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({ where: { userId }, data, include: userInclude });
    const { password: _, ...result } = user;
    return sendSuccess(res, result, 'Cập nhật người dùng thành công!');
  } catch (err) {
    if (err.code === 'P2025') return sendError(res, 'Người dùng không tồn tại.', 404);
    return sendError(res, err.message);
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (userId === req.user.userId) return sendError(res, 'Bạn không thể tự xóa chính mình.', 400);

  try {
    const target = await prisma.user.findUnique({ where: { userId } });
    if (!target) return sendError(res, 'Người dùng không tồn tại.', 404);
    if (target.isAdmin === 1) return sendError(res, 'Không thể xóa tài khoản quản trị viên.', 403);

    await prisma.user.delete({ where: { userId } });
    return sendSuccess(res, null, 'Xóa người dùng thành công!');
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const importUsers = async (req, res) => {
  const { users } = req.body;
  if (!users || !Array.isArray(users)) return sendError(res, 'Dữ liệu không hợp lệ.', 400);

  const results = { success: 0, failed: 0, errors: [] };
  for (const u of users) {
    try {
      const hashed = await bcrypt.hash(u.password || '123456', 10);
      await prisma.user.create({
        data: {
          userName: u.userName, fullName: u.fullName, email: u.email,
          password: hashed, roleName: u.roleName || 'Đoàn viên',
          unitId: u.unitId ? parseInt(u.unitId) : null,
          identifyCard: u.identifyCard,
          gender: u.gender !== undefined ? parseInt(u.gender) : null,
          birthDate: u.birthDate ? new Date(u.birthDate) : null,
          joinDate: u.joinDate ? new Date(u.joinDate) : null,
          isAdmin: 0,
        },
      });
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push({ row: u.userName, error: err.message });
    }
  }
  return sendSuccess(res, results, `Import hoàn thành: ${results.success} thành công, ${results.failed} thất bại.`);
};
