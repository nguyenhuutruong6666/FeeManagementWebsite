import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AllocateTransfer = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Phân bổ & Chuyển nộp đoàn phí</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto'}}>
                <div style={{marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderLeft: '4px solid #0984e3'}}>
                    <p style={{margin: '0 0 10px 0'}}><b>Tổng quỹ hiện có:</b> 2.450.000đ</p>
                    <p style={{margin: 0}}><b>Tỷ lệ giữ lại:</b> 60% (1.470.000đ)</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); alert('Chuyển nộp mock'); navigate('/feecashbooksummary'); }}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Số tiền chuyển nộp lên cấp trên (40%):</label>
                        <input type="number" defaultValue="980000" disabled style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', background: '#e9ecef'}} />
                    </div>
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Bằng chứng chuyển khoản (Ảnh Hóa đơn/UNC):</label>
                        <input type="file" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div>
                        <button type="submit" style={{padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px'}}>Xác nhận chuyển nộp</button>
                        <Link to="/feecashbooksummary" style={{padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'}}>Quay lại</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AllocateTransfer;
