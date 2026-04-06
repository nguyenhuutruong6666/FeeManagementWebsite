import { useState } from 'react';
import { Link } from 'react-router-dom';

const ActivityApproval = () => {
    return (
        <div className="container">
            <h2>Phê duyệt hoạt động</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Đơn vị đề xuất</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Tên hoạt động</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Kinh phí</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Trạng thái</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>Chi đoàn K72E1</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>Đại hội Chi đoàn</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>500.000đ</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#e67e22', fontWeight: 'bold'}}>Đang trình duyệt</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>
                                <button style={{padding: '5px 10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px'}} onClick={() => alert('Đã phê duyệt')}>Duyệt</button>
                                <button style={{padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}} onClick={() => alert('Từ chối')}>Từ chối</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{marginTop: '20px', textAlign: 'right'}}>
                    <Link to="/activity-management" style={{padding: '8px 15px', background: '#6c757d', color: 'white', borderRadius: '6px', textDecoration: 'none'}}>Quay về</Link>
                </div>
            </div>
        </div>
    );
};

export default ActivityApproval;
