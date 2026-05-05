# Hệ Thống Quản Lý Thu Phí (Fee Management System)

Dự án là một hệ thống web cho phép quản lý thu phí, thành viên, đơn vị và các hoạt động một cách chuyên nghiệp. 
- **Backend:** Node.js, Express, Prisma (PostgreSQL).
- **Frontend:** React (Vite), Zustand, Sass, Axios.

---

## 1. Yêu cầu hệ thống

### 1.1. Yêu cầu phần cứng
- **CPU:** Dual-core 2.0 GHz trở lên.
- **RAM:** Tối thiểu 4GB (Khuyến nghị 8GB để chạy mượt cả Backend, Frontend và Database cùng lúc).
- **Ổ cứng:** Còn trống tối thiểu 5GB để chứa source code, các dependencies (node_modules) và dữ liệu cơ sở dữ liệu.

### 1.2. Yêu cầu phần mềm
- **Hệ điều hành:** Windows, macOS, hoặc Linux.
- **Node.js:** Phiên bản 18.x trở lên (Khuyến nghị bản LTS mới nhất).
- **Database:** PostgreSQL (phiên bản 14 trở lên).
- **Công cụ quản lý phiên bản:** Git.
- **Trình duyệt web:** Google Chrome, Firefox, hoặc Edge (phiên bản mới nhất).
- **IDE/Text Editor:** Visual Studio Code (khuyên dùng).

---

## 2. Cài đặt môi trường

1. **Cài đặt Node.js:** Tải và cài đặt tại [Node.js Official Website](https://nodejs.org/).
2. **Cài đặt PostgreSQL:** Tải và cài đặt tại [PostgreSQL Official Website](https://www.postgresql.org/). Hãy ghi nhớ `username` và `password` bạn thiết lập trong quá trình cài đặt (mặc định user thường là `postgres`).
3. **Cài đặt Git:** Tải và cài đặt tại [Git Official Website](https://git-scm.com/).

---

## 3. Clone dự án từ GitHub

Mở Terminal (hoặc Command Prompt, PowerShell, Git Bash) và chạy lệnh:

```bash
git clone <đường-dẫn-repo-của-bạn>
cd FeeManagement
```

*(Lưu ý: Thay `<đường-dẫn-repo-của-bạn>` bằng URL clone từ Github của bạn)*

---

## 4. Cài đặt và cấu hình database

1. Mở pgAdmin (được cài đặt kèm PostgreSQL) hoặc công cụ quản lý CSDL bất kỳ (DBeaver, DataGrip...).
2. Tạo một database mới với tên: `db_feemanagement` (hoặc tên tùy ý theo ý muốn).
3. Di chuyển vào thư mục backend và copy file cấu hình môi trường:
   ```bash
   cd backend
   cp .env.example .env 
   ```
   *(Nếu chưa có file `.env.example`, bạn có thể tạo thủ công file `.env`)*
4. Mở file `.env` ở thư mục `backend` và cấu hình chuỗi kết nối Database `DATABASE_URL`:
   ```env
   # Định dạng: postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public
   DATABASE_URL="postgresql://postgres:123456@localhost:5432/db_feemanagement?schema=public"
   ```
   *(Nhớ thay đổi username, password và tên database cho khớp với máy của bạn)*
5. Cài đặt các thư viện cho backend:
   ```bash
   npm install
   ```
6. Đồng bộ cấu trúc Database và khởi tạo dữ liệu mẫu (Seed):
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

---

## 5. Cài đặt và chạy Backend

Từ thư mục gốc của dự án, di chuyển vào thư mục `backend` (nếu chưa ở đó):

```bash
cd backend
```

Chạy môi trường phát triển (Development):
```bash
npm run dev
```
*Backend sẽ khởi chạy và lắng nghe tại cổng `5000` (http://localhost:5000).*

---

## 6. Cài đặt và chạy Frontend

Mở một Terminal mới (giữ Terminal của backend tiếp tục chạy), từ thư mục gốc của dự án, di chuyển vào thư mục `frontend`:

```bash
cd frontend
```

Cài đặt các thư viện cho frontend:
```bash
npm install
```

Chạy môi trường phát triển (Development):
```bash
npm run dev
```
*Frontend sẽ khởi chạy bằng Vite (thường là tại http://localhost:5173).*

---

## 7. Hướng dẫn sử dụng cơ bản

1. **Truy cập ứng dụng:** Mở trình duyệt web và truy cập vào đường dẫn mà Vite cung cấp (ví dụ: `http://localhost:5173`).
2. **Đăng nhập:** 
   - Sử dụng tài khoản mặc định (đã được tạo tự động khi chạy lệnh `npm run seed` ở bước 4). 
   - Nếu chưa rõ tài khoản, bạn có thể xem file `backend/prisma/seed.js` hoặc xem bảng `users` trong cơ sở dữ liệu.
3. **Tổng quan (Dashboard):** Sau khi đăng nhập, hệ thống sẽ hiển thị Dashboard với các thông tin tổng quát về hoạt động thu phí.
4. **Cấu hình & Quản lý:** 
   - Cài đặt chính sách phí (`Policy Settings`).
   - Quản lý danh sách Người dùng (`Users`), Thành viên (`Members`), Đơn vị (`Units`).
   - Tạo các Nghĩa vụ phí (`Generate Fee Obligation`) và Quản lý Thu tiền (`Pay Fee`).
   - Xem tổng hợp các khoản giao dịch (`Fee Cashbook Summary`) và Báo cáo (`Report Summary`).
5. **Trang Prisma Studio (Tùy chọn):** Nếu muốn xem trực tiếp Database qua giao diện web, chạy lệnh `npx prisma studio` ở thư mục `backend`.

Chúc bạn cài đặt và sử dụng phần mềm hiệu quả!
