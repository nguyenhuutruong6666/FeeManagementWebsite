import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.scss';

const ChangePassword = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="page-header">
                <h2>Đổi mật khẩu</h2>
                <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
            </div>

            <div className="auth-card-wrapper">
                <div className="password-card">
                    <div className="card-icon-header">
                        <div className="icon-circle shadow-pulse">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                    </div>

                    <form className="password-form" onSubmit={(e) => { e.preventDefault(); alert('Đổi mật khẩu thành công!'); navigate('/profile'); }}>
                        <div className="form-group-modern">
                            <label>Mật khẩu hiện tại</label>
                            <input type="password" required placeholder="Nhập mật khẩu hiện tại" />
                        </div>
                        <div className="form-group-modern">
                            <label>Mật khẩu mới</label>
                            <input type="password" required placeholder="Nhập mật khẩu mới" />
                        </div>
                        <div className="form-group-modern">
                            <label>Xác nhận mật khẩu mới</label>
                            <input type="password" required placeholder="Nhập lại mật khẩu mới" />
                        </div>

                        <div className="form-actions-row">
                            <button type="submit" className="btn-primary btn-block">Lưu thay đổi</button>
                            <Link to="/profile" className="btn-secondary btn-block">Hủy bỏ</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
