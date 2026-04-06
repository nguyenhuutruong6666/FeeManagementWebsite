import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import './UserForm.scss';

const AddUser = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // In a real implementation we would fetch these from an API
    // For now we mock the exact UI layout from add_user.php
    useEffect(() => {
        if (user?.isAdmin !== 1) {
            alert('Bạn không có quyền truy cập');
            navigate('/users');
        }
    }, [user, navigate]);

    return (
         <div className="container">
            <h2>Thêm người dùng mới</h2>
            <form className="form-add" onSubmit={(e) => { e.preventDefault(); navigate('/users'); }}>
                <div className="form-group">
                    <label>Tên đăng nhập:</label>
                    <input type="text" name="userName" required />
                </div>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input type="text" name="fullName" required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required />
                </div>
                <div className="form-group">
                    <label>MSSV / CCCD:</label>
                    <input type="text" name="identifyCard" required />
                </div>
                <div className="form-group">
                    <label>Giới tính:</label>
                    <select name="gender">
                        <option value="M">Nam</option>
                        <option value="F">Nữ</option>
                        <option value="O">Khác</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Ngày sinh:</label>
                    <input type="date" name="birthDate" />
                </div>
                <div className="form-group">
                    <label>Ngày vào Đoàn:</label>
                    <input type="date" name="joinDate" />
                </div>
                <div className="form-group">
                    <label>Đơn vị:</label>
                    <select name="unit_id" required>
                        <option value="">-- Chọn đơn vị --</option>
                        <option value="1">ĐH Sư phạm (Trường)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Vai trò:</label>
                    <select name="role_name" required>
                        <option value="Đoàn viên">Đoàn viên</option>
                        <option value="BCH Chi đoàn">BCH Chi đoàn</option>
                        <option value="BCH Khoa">BCH Khoa</option>
                        <option value="BCH Trường">BCH Trường</option>
                        <option value="Quản trị viên">Quản trị viên</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Mật khẩu mặc định:</label>
                    <input type="text" name="password" defaultValue="123456" />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-save">Lưu</button>
                    <Link to="/users" className="btn-back">Quay lại</Link>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
