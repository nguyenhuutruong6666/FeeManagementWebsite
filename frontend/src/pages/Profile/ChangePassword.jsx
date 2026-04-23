import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../components/Common/ToastNotification';
import ConfirmModal from '../../components/Common/ConfirmModal';
import './Profile.scss';

// SVG Icons cho Show/Hide Mật khẩu
const IconEye = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const IconEyeOff = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const ChangePassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // State cho popup xác nhận
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.currentPassword) {
            toast.warning('Vui lòng nhập mật khẩu hiện tại.');
            return false;
        }
        if (formData.newPassword.length < 6) {
            toast.warning('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.warning('Mật khẩu xác nhận không khớp.');
            return false;
        }
        return true;
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsConfirmOpen(true);
        }
    };

    const handleSubmit = async () => {
        setIsConfirmOpen(false);
        setLoading(true);
        try {
            const res = await api.post('/auth/change-password', formData);
            if (res.success) {
                toast.success(res.message || 'Đổi mật khẩu thành công!');
                // Đợi một chút để người dùng đọc thông báo rồi chuyển hướng
                setTimeout(() => {
                    navigate('/profile');
                }, 1500);
            }
        } catch (error) {
            toast.error(error.message || 'Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Đổi mật khẩu</h2>
                <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
            </div>

            <div className="auth-card-wrapper">
                <div className="password-card">
                    <div className="card-icon-header">
                        <div className="icon-circle shadow-pulse" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                    </div>

                    <form className="password-form" onSubmit={handlePreSubmit}>
                        
                        <div className="form-group-modern" style={{ position: 'relative' }}>
                            <label>Mật khẩu hiện tại</label>
                            <input 
                                type={showCurrent ? 'text' : 'password'} 
                                name="currentPassword"
                                required 
                                placeholder="Nhập mật khẩu hiện tại" 
                                value={formData.currentPassword}
                                onChange={handleChange}
                                style={{ paddingRight: '40px' }}
                            />
                            <button 
                                type="button" 
                                className="toggle-password-btn" 
                                onClick={() => setShowCurrent(!showCurrent)}
                                style={{ position: 'absolute', right: '12px', top: '38px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                {showCurrent ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>
                        
                        <div className="form-group-modern" style={{ position: 'relative' }}>
                            <label>Mật khẩu mới</label>
                            <input 
                                type={showNew ? 'text' : 'password'} 
                                name="newPassword"
                                required 
                                placeholder="Nhập mật khẩu mới" 
                                value={formData.newPassword}
                                onChange={handleChange}
                                style={{ paddingRight: '40px' }}
                            />
                            <button 
                                type="button" 
                                className="toggle-password-btn" 
                                onClick={() => setShowNew(!showNew)}
                                style={{ position: 'absolute', right: '12px', top: '38px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                {showNew ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>
                        
                        <div className="form-group-modern" style={{ position: 'relative' }}>
                            <label>Xác nhận mật khẩu mới</label>
                            <input 
                                type={showConfirm ? 'text' : 'password'} 
                                name="confirmPassword"
                                required 
                                placeholder="Nhập lại mật khẩu mới" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ paddingRight: '40px' }}
                            />
                            <button 
                                type="button" 
                                className="toggle-password-btn" 
                                onClick={() => setShowConfirm(!showConfirm)}
                                style={{ position: 'absolute', right: '12px', top: '38px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                {showConfirm ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>

                        <div className="form-actions-row">
                            <button type="submit" className="btn-primary btn-block" disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                            </button>
                            <Link to="/profile" className="btn-secondary btn-block">Hủy bỏ</Link>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                toggle={() => setIsConfirmOpen(false)}
                title="Xác nhận đổi mật khẩu"
                message="Bạn có chắc chắn muốn thay đổi mật khẩu không? Nếu tiếp tục, mật khẩu mới sẽ được cập nhật và bạn sẽ sử dụng nó cho các lần đăng nhập tiếp theo."
                onConfirm={handleSubmit}
                confirmText="Đồng ý thay đổi"
                cancelText="Hủy"
                variant="info"
            />
        </div>
    );
};

export default ChangePassword;
