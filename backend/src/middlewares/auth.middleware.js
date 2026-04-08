import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import prisma from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: {
        userId: true, userName: true, fullName: true, email: true,
        roleName: true, isAdmin: true, unitId: true,
        identifyCard: true, gender: true, birthDate: true, joinDate: true,
        unitBrand: { include: { unit: true, brand: true } },
      },
    });

    if (!user) {
      return sendError(res, 'Tài khoản không tồn tại.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Token không hợp lệ hoặc đã hết hạn.', 401);
  }
};
