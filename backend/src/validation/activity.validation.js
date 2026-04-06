import { body } from 'express-validator';

export const createActivityValidation = [
  body('title').trim().notEmpty().withMessage('Tên hoạt động không được để trống.'),
  body('estimatedBudget').isFloat({ min: 0 }).withMessage('Kinh phí dự kiến không hợp lệ.'),
  body('expectedDate').isISO8601().withMessage('Ngày dự kiến không hợp lệ.'),
];

export const approveActivityValidation = [
  body('approvedBudget').isFloat({ min: 0 }).withMessage('Kinh phí phê duyệt không hợp lệ.'),
  body('approvalComment').trim().notEmpty().withMessage('Vui lòng nhập nhận xét phê duyệt.'),
];

export const rejectActivityValidation = [
  body('rejectionReason').trim().notEmpty().withMessage('Vui lòng nhập lý do từ chối.'),
];
