import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { userName, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ userName }, { email: userName }] },
      include: { unitBrand: { include: { unit: true, brand: true } } },
    });

    if (!user) return sendError(res, 'Tài khoản không tồn tại!', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 'Sai mật khẩu!', 401);

    const token = generateToken({ userId: user.userId, userName: user.userName, isAdmin: user.isAdmin });

    const { password: _, ...userWithoutPwd } = user;
    return sendSuccess(res, { user: userWithoutPwd, token }, 'Đăng nhập thành công!');
  } catch (err) {
    return sendError(res, 'Lỗi hệ thống: ' + err.message, 500);
  }
};

export const getMe = async (req, res) => {
  return sendSuccess(res, req.user, 'Lấy thông tin thành công.');
};

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;
  try {
    const user = await prisma.user.findUnique({ where: { userId } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return sendError(res, 'Mật khẩu hiện tại không đúng.', 400);

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { userId }, data: { password: hashed } });
    return sendSuccess(res, null, 'Đổi mật khẩu thành công!');
  } catch (err) {
    return sendError(res, 'Lỗi hệ thống: ' + err.message, 500);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendError(res, 'Email không tồn tại trong hệ thống.', 404);

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashed } });

    return sendSuccess(res, { tempPassword }, `Mật khẩu tạm thời: ${tempPassword}. Vui lòng đổi mật khẩu sau khi đăng nhập.`);
  } catch (err) {
    return sendError(res, 'Lỗi hệ thống: ' + err.message, 500);
  }
};
