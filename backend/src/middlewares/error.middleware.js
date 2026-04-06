export const errorMiddleware = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Dữ liệu đã tồn tại (vi phạm ràng buộc duy nhất).', errors: err.meta });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu.', errors: err.meta });
    }
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ.', errors: err.errors });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi hệ thống. Vui lòng thử lại sau.',
  });
};
