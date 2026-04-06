import { sendError } from '../utils/response.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== 1) {
    return sendError(res, 'Chỉ quản trị viên mới có quyền thực hiện chức năng này.', 403);
  }
  next();
};

export const requireBCH = (req, res, next) => {
  const bchRoles = ['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'];
  if (!req.user) return sendError(res, 'Chưa xác thực.', 401);
  if (req.user.isAdmin === 1 || bchRoles.includes(req.user.roleName)) {
    return next();
  }
  return sendError(res, 'Bạn không có quyền truy cập chức năng này.', 403);
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return sendError(res, 'Chưa xác thực.', 401);
    if (req.user.isAdmin === 1 || roles.includes(req.user.roleName)) {
      return next();
    }
    return sendError(res, 'Bạn không có quyền truy cập chức năng này.', 403);
  };
};

export const requireAdminOrBCHTruong = requireRole('BCH Trường');
