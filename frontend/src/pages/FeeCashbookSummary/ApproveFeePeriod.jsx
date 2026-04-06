import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ApproveFeePeriod = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Phê duyệt kỳ thu phí</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto'}}>
                <p>Danh sách các báo cáo nộp hoặc phân bổ cấp dưới chờ phê duyệt:</p>
                <div style={{border: '1px solid #eee', padding: '15px', borderRadius: '6px', marginBottom: '15px'}}>
                    <p><b>Đơn vị báo cáo:</b> Chi đoàn K72E1</p>
                    <p><b>Số tiền thu được:</b> 2.400.000đ</p>
                    <p><b>Số tiền nộp (40%):</b> 960.000đ</p>
                    <p>Trạng thái: <span style={{color: '#e67e22', fontWeight: 'bold'}}>Chờ duyệt</span></p>
                    <div style={{marginTop: '10px'}}>
                         <button style={{padding: '6px 12px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px'}} onClick={() => alert('Đã duyệt')}>Duyệt</button>
                         <button style={{padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}} onClick={() => alert('Từ chối')}>Từ chối</button>
                    </div>
                </div>
                <div style={{textAlign: 'right'}}>
                    <Link to="/fee-cashbook-summary" style={{padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'}}>Quay về Sổ quỹ</Link>
                </div>
            </div>
        </div>
    );
};

export default ApproveFeePeriod;
