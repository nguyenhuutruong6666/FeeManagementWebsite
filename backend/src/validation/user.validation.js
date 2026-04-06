import { body } from 'express-validator';

export const createUserValidation = [
  body('userName').trim().notEmpty().withMessage('Tên đăng nhập không được để trống.')
    .isLength({ min: 3 }).withMessage('Tên đăng nhập phải có ít nhất 3 ký tự.'),
  body('fullName').trim().notEmpty().withMessage('Họ và tên không được để trống.'),
  body('email').isEmail().withMessage('Email không hợp lệ.'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự.'),
  body('roleName').notEmpty().withMessage('Vui lòng chọn vai trò.'),
  body('unitId').isInt({ gt: 0 }).withMessage('Vui lòng chọn đơn vị.'),
];

export const updateUserValidation = [
  body('fullName').trim().notEmpty().withMessage('Họ và tên không được để trống.'),
  body('email').isEmail().withMessage('Email không hợp lệ.'),
  body('roleName').notEmpty().withMessage('Vui lòng chọn vai trò.'),
];
