import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Đổi mật khẩu</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto'}}>
                <form onSubmit={(e) => { e.preventDefault(); alert('Đổi mật khẩu thành công!'); navigate('/profile'); }}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Mật khẩu hiện tại:</label>
                        <input type="password" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Mật khẩu mới:</label>
                        <input type="password" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Xác nhận mật khẩu mới:</label>
                        <input type="password" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div>
                        <button type="submit" style={{padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px'}}>Đổi mật khẩu</button>
                        <Link to="/profile" style={{padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'}}>Hủy</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
