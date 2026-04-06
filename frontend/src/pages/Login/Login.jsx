import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import useAuthStore from '../../store/authStore';
import './Login.scss';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ userName, password });
            if (response.success) {
                setAuth(response.data.user, response.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="brand">
                    <img src="/hnue.png" alt="Logo Đoành" className="logo-img" />
                    <h2>QUẢN LÝ ĐOÀN PHÍ</h2>
                    <p>Đăng nhập để vào hệ thống nội bộ</p>
                </div>
                
                {error && <div className="error" style={{textAlign:'center', fontSize:'0.9rem'}}>{error}</div>}
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Tên đăng nhập / Email / CCCD" 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)} 
                            required 
                        />
                        <span className="input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </span>
                    </div>
                    
                    <div className="input-wrapper">
                        <input 
                            type="password" 
                            placeholder="Mật khẩu của bạn" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <span className="input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </span>
                    </div>
                    
                    <div className="options">
                        <label>
                            <input type="checkbox" name="remember" /> Ghi nhớ đăng nhập
                        </label>
                        <Link to="/forgotpassword">Quên mật khẩu?</Link>
                    </div>
                    
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
