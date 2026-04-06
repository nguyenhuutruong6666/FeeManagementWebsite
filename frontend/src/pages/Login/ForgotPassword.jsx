import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9'}}>
            <div style={{background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'}}>
                <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#2d3436'}}>Quên mật khẩu</h2>
                <form onSubmit={(e) => { e.preventDefault(); alert('Vui lòng kiểm tra email của bạn!'); }}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Email của bạn:</label>
                        <input type="email" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <button type="submit" style={{width: '100%', padding: '10px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>Gửi liên kết đặt lại mật khẩu</button>
                    <div style={{textAlign: 'center', marginTop: '15px'}}>
                        <Link to="/login" style={{color: '#0984e3', textDecoration: 'none'}}>Quay lại đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
