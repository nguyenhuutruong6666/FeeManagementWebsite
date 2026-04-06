import { body } from 'express-validator';

export const loginValidation = [
  body('userName').trim().notEmpty().withMessage('Vui lòng nhập tên đăng nhập hoặc email.'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu.'),
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Vui lòng nhập mật khẩu hiện tại.'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) throw new Error('Mật khẩu xác nhận không khớp.');
    return true;
  }),
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Email không hợp lệ.'),
];
