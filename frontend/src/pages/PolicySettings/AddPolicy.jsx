import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Thiết lập chính sách đoàn phí</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto'}}>
                <form onSubmit={(e) => { e.preventDefault(); navigate('/policy-settings'); }}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Tên chính sách:</label>
                        <input type="text" required placeholder="VD: Đoàn phí năm học 2024-2025" style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>
                    
                    <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                        <div style={{flex: 1}}>
                            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Chu kỳ nộp:</label>
                            <select required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}}>
                                <option value="Tháng">Hàng tháng</option>
                                <option value="Học kỳ">Theo học kỳ</option>
                                <option value="Năm">Hàng năm</option>
                            </select>
                        </div>
                        <div style={{flex: 1}}>
                            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Mức thu mặc định (VNĐ):</label>
                            <input type="number" required defaultValue="24000" style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                        </div>
                    </div>

                    <div style={{marginBottom: '15px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Luật giảm trừ (JSON):</label>
                        <textarea placeholder={`{"BCH Chi đoàn": 12000, "BCH Khoa": 24000}`} rows="4" style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}}></textarea>
                    </div>

                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Hạn nộp đầu tiên:</label>
                        <input type="date" required style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} />
                    </div>

                    <div>
                        <button type="submit" style={{padding: '10px 20px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px'}}>Lưu chính sách</button>
                        <Link to="/policy-settings" style={{padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'}}>Quay lại</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPolicy;
