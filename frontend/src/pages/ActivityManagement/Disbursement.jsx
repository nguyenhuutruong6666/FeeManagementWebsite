import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Disbursement = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Xuất phiếu chi (Giải ngân)</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto'}}>
                <form onSubmit={(e) => { e.preventDefault(); alert('Lưu phiếu chi thành công!'); navigate('/activity-management'); }}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Hoạt động (đã duyệt):</label>
                        <select required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}}>
                            <option value="">-- Chọn hoạt động --</option>
                            <option value="1">Đại hội Chi đoàn - 500.000đ</option>
                        </select>
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Số tiền chi (VNĐ):</label>
                        <input type="number" required defaultValue="500000" style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Ghi chú chi:</label>
                        <textarea rows="3" style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}}></textarea>
                    </div>
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Mã phiếu chi:</label>
                        <input type="text" value={`PC-${new Date().getTime()}`} disabled style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', background: '#f8f9fa'}} />
                    </div>
                    <div>
                        <button type="submit" style={{padding: '10px 20px', background: '#00b894', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px'}}>Xuất phiếu chi</button>
                        <Link to="/activity-management" style={{padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'}}>Hủy</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Disbursement;
