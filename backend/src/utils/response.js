export const sendSuccess = (res, data = null, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res, message = 'Lỗi hệ thống', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

export const sendPaginated = (res, data, total, page, limit, message = 'Thành công') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};
