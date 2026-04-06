import { body } from 'express-validator';

export const createPolicyValidation = [
  body('policyName').trim().notEmpty().withMessage('Tên chính sách không được để trống.'),
  body('cycle').isIn(['Tháng', 'Học kỳ', 'Năm']).withMessage('Chu kỳ không hợp lệ.'),
  body('dueDate').isISO8601().withMessage('Hạn nộp không hợp lệ.'),
  body('standardAmount').isFloat({ gt: 0 }).withMessage('Mức thu phải lớn hơn 0.'),
];

export const generateObligationValidation = [
  body('policyId').isInt({ gt: 0 }).withMessage('Vui lòng chọn chính sách.'),
  body('periodLabel').trim().notEmpty().withMessage('Nhãn kỳ không được để trống.'),
];

export const paymentValidation = [
  body('obligationId').isInt({ gt: 0 }).withMessage('ID nghĩa vụ không hợp lệ.'),
  body('method').isIn(['Cash', 'VNPAY']).withMessage('Phương thức thanh toán không hợp lệ.'),
  body('amount').isFloat({ gt: 0 }).withMessage('Số tiền phải lớn hơn 0.'),
];
