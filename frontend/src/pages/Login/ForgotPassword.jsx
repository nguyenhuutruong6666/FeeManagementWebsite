import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.scss';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Giả lập call API 
        setSubmitted(true);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="brand">
                    <div style={{
                        width: '60px', height: '60px', margin: '0 auto 15px', 
                        background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#0284c7'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h2>Khôi phục mật khẩu</h2>
                    <p>Nhập email của ban để nhận mã lấy lại mật khẩu</p>
                </div>
                
                {!submitted ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <input 
                                type="email" 
                                placeholder="Địa chỉ Email đã đăng ký..." 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                            <span className="input-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </span>
                        </div>
                        
                        <button type="submit" className="btn-submit">
                            GỬI LIÊN KẾT ĐẶT LẠI
                        </button>
                    </form>
                ) : (
                    <div className="success" style={{textAlign: 'center', marginTop: '20px'}}>
                        <p style={{margin: '0 0 10px 0'}}>✅ <b>Đã gửi thành công!</b></p>
                        <p style={{fontSize: '0.9rem', color: '#64748b', margin: 0}}>
                            Vui lòng kiểm tra hộp thư email <b>{email}</b> của bạn và làm theo hướng dẫn.
                        </p>
                    </div>
                )}
                
                <div className="auth-footer">
                    Nhớ ra mật khẩu rồi? <Link to="/login">Trở về Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
