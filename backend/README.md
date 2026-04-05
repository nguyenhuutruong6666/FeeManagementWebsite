# FeeManagement - Backend

Backend API cho hệ thống quản lý phí, xây dựng bằng Node.js + Express + MongoDB.

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/         # Cấu hình Database, Cloudinary, v.v.
│   ├── controllers/    # Xử lý logic nghiệp vụ cho từng route
│   ├── models/         # Định nghĩa cấu trúc dữ liệu (Mongoose Schema)
│   ├── routes/         # Khai báo các đường dẫn API
│   ├── middlewares/    # Kiểm tra Auth, phân quyền, xử lý lỗi
│   ├── utils/          # Các hàm tiện ích dùng chung ở server
│   └── app.js          # Cấu hình Express và middleware
├── .env                # Biến môi trường (không commit lên git)
├── server.js           # Điểm khởi chạy server
├── package.json
└── README.md
```

## 🚀 Cài đặt & Chạy

```bash
# Cài dependencies
npm install

# Chạy development
npm run dev

# Chạy production
npm start
```

## 🔧 Biến môi trường (.env)

Tạo file `.env` từ `.env.example` và điền thông tin:

- `PORT` - Cổng chạy server (mặc định: 5000)
- `DB_URI` - MongoDB connection string
- `JWT_SECRET` - Khóa bí mật cho JWT
