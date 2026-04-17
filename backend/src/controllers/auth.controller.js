import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

const otpStore = new Map();

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

export const checkOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { email, otp } = req.body;
  const record = otpStore.get(email);
  if (!record) return sendError(res, 'Mã OTP không hợp lệ hoặc đã hết hạn.', 400);
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return sendError(res, 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.', 400);
  }
  if (record.otp !== otp) return sendError(res, 'Mã OTP không đúng. Vui lòng kiểm tra lại.', 400);

  return sendSuccess(res, null, 'Mã OTP hợp lệ.');
};

export const sendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendError(res, 'Email không tồn tại trong hệ thống.', 404);

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Quản Lý Đoàn Phí" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Mã xác thực đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-bottom: 8px;">Đặt lại mật khẩu</h2>
          <p style="color: #475569;">Xin chào <strong>${user.fullName || user.userName}</strong>,</p>
          <p style="color: #475569;">Mã xác thực của bạn là:</p>
          <div style="font-size: 2.5rem; font-weight: 800; letter-spacing: 12px; color: #0ea5e9; text-align: center; padding: 20px 0; background: #f0f9ff; border-radius: 8px; margin: 16px 0;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 0.9rem;">Mã có hiệu lực trong <strong>5 phút</strong>. Không chia sẻ mã này cho bất kỳ ai.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 0.8rem;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
        </div>
      `,
    });

    return sendSuccess(res, null, 'Mã OTP đã được gửi đến email của bạn.');
  } catch (err) {
    return sendError(res, 'Không thể gửi email. Vui lòng thử lại: ' + err.message, 500);
  }
};

export const verifyOtpAndReset = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 400);

  const { email, otp, newPassword } = req.body;
  try {
    const record = otpStore.get(email);
    if (!record) return sendError(res, 'Mã OTP không hợp lệ hoặc đã hết hạn.', 400);
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return sendError(res, 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.', 400);
    }
    if (record.otp !== otp) return sendError(res, 'Mã OTP không đúng. Vui lòng kiểm tra lại.', 400);

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashed } });
    otpStore.delete(email);

    return sendSuccess(res, null, 'Đặt lại mật khẩu thành công!');
  } catch (err) {
    return sendError(res, 'Lỗi hệ thống: ' + err.message, 500);
  }
};
