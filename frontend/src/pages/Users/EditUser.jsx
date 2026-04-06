import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './UserForm.scss';

const EditUser = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams();

    return (
         <div className="container">
            <h2>Chỉnh sửa thông tin tài khoản</h2>
            <form className="form-edit" onSubmit={(e) => { e.preventDefault(); navigate('/users'); }}>
                <div className="form-group">
                    <label>Tên đăng nhập:</label>
                    <input type="text" value="mock_user" disabled />
                </div>
                <div className="form-group">
                    <label>MSV/CCCD:</label>
                    <input type="text" value="123456789" disabled />
                </div>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input type="text" name="fullName" defaultValue="Nguyễn Văn A" required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" defaultValue="user@example.com" required />
                </div>
                <div className="form-group">
                    <label>Năm sinh:</label>
                    <input type="date" name="birthDate" />
                </div>
                <div className="form-group">
                    <label>Giới tính:</label>
                    <select name="gender" defaultValue="M">
                        <option value="M">Nam</option>
                        <option value="F">Nữ</option>
                        <option value="O">Khác</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Ngày vào Đoàn:</label>
                    <input type="date" name="joinDate" />
                </div>
                
                {user?.isAdmin === 1 ? (
                    <div className="form-group">
                        <label>Đơn vị:</label>
                        <select name="unit_id" required defaultValue="1">
                            <option value="">-- Chọn đơn vị --</option>
                            <option value="1">ĐH Sư phạm</option>
                        </select>
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Đơn vị:</label>
                        <input type="text" value="ĐH Sư phạm" disabled />
                    </div>
                )}

                {user?.isAdmin === 1 ? (
                    <div className="form-group">
                        <label>Vai trò:</label>
                        <select name="role_name" defaultValue="Đoàn viên">
                            <option value="Quản trị viên">Quản trị viên</option>
                            <option value="BCH Trường">BCH Trường</option>
                            <option value="BCH Khoa">BCH Khoa</option>
                            <option value="BCH Chi đoàn">BCH Chi đoàn</option>
                            <option value="Đoàn viên">Đoàn viên</option>
                        </select>
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Vai trò:</label>
                        <input type="text" value="Đoàn viên" disabled />
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="btn-save">Lưu thay đổi</button>
                    <Link to={id ? `/users` : `/profile`} className="btn-back">Quay lại</Link>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
