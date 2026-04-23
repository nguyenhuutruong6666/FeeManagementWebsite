import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenhuutruongchatgpt@gmail.com',
    pass: 'jbee qhxa hitr nqyv', // App password provided by user
  },
});

export const sendRemindEmail = async (to, fullName, periodLabel, amount, dueDate) => {
  const mailOptions = {
    from: '"Hệ thống Quản lý Đoàn phí" <nguyenhuutruongchatgpt@gmail.com>',
    to,
    subject: `[NHẮC NỢ ĐOÀN PHÍ] - ${periodLabel}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #d32f2f;">Thông báo nhắc nợ Đoàn phí</h2>
        <p>Chào bạn <strong>${fullName}</strong>,</p>
        <p>Hệ thống ghi nhận bạn hiện vẫn chưa hoàn thành nghĩa vụ nộp Đoàn phí cho kỳ: <strong>${periodLabel}</strong>.</p>
        <p>Thông tin chi tiết:</p>
        <ul>
          <li><strong>Số tiền:</strong> ${new Intl.NumberFormat('vi-VN').format(amount)} đ</li>
          <li><strong>Hạn nộp:</strong> ${new Date(dueDate).toLocaleDateString('vi-VN')}</li>
        </ul>
        <p>Vui lòng đăng nhập vào hệ thống để thực hiện nộp phí bằng hình thức Tiền mặt hoặc Chuyển khoản (VNPay) sớm nhất có thể.</p>
        <p>Trân trọng,<br>Ban Chấp hành Đoàn trường</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export default transporter;
