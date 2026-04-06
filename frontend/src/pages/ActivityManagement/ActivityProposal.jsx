import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ActivityProposal = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Đề xuất hoạt động</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto'}}>
                <form onSubmit={(e) => { e.preventDefault(); alert('Đề xuất thành công!'); navigate('/activity-management'); }}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Tên hoạt động:</label>
                        <input type="text" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Mô tả hoạt động:</label>
                        <textarea required rows="4" style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}}></textarea>
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Kinh phí dự kiến (VNĐ):</label>
                        <input type="number" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>File đính kèm (Kế hoạch chi tiết):</label>
                        <input type="file" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div>
                        <button type="submit" style={{padding: '10px 20px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px'}}>Gửi đề xuất</button>
                        <Link to="/activity-management" style={{padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'}}>Hủy</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityProposal;
