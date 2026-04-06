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
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>HỆ THỐNG QUẢN LÝ ĐOÀN PHÍ</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Tên đăng nhập hoặc Email" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Mật khẩu" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                <div className="forgot">
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
