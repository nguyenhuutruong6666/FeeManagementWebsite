import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const updateProfile = async (req, res) => {
  try {
    const { fullName, gender, birthDate } = req.body;
    const updated = await prisma.user.update({
        where: { userId: req.user.userId },
        data: {
            fullName,
            gender: gender !== undefined ? parseInt(gender) : req.user.gender,
            birthDate: birthDate ? new Date(birthDate) : req.user.birthDate
        }
    });
    
    const { password, ...user } = updated;
    return sendSuccess(res, user, 'Thông tin cá nhân đã được cập nhật.');
  } catch (err) {
    return sendError(res, err.message);
  }
};
