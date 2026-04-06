import { useState } from 'react';
import { Link } from 'react-router-dom';

const RemindDebtors = () => {
    return (
        <div className="container">
            <h2>Nhắc nợ Đoàn viên</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <div style={{marginBottom: '20px'}}>
                    <button style={{padding: '10px 20px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => alert('Đã gửi email nhắc nhở tới tất cả đoàn viên chưa nộp!')}>Gửi thông báo nhắc nợ (Tất cả)</button>
                </div>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Họ tên</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Kỳ phí</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Số tiền</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Hạn nộp</th>
                            <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>Lê Thị C</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>HK1/2025</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold'}}>24.000đ</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#e74c3c'}}>30/05/2024</td>
                            <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>
                                <button style={{padding: '5px 10px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}} onClick={() => alert('Đã gửi mail riêng')}>Nhắc riêng</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{marginTop: '20px'}}>
                     <Link to="/pay-fee" style={{padding: '8px 15px', background: '#6c757d', color: 'white', borderRadius: '6px', textDecoration: 'none'}}>Quay về</Link>
                </div>
            </div>
        </div>
    );
};

export default RemindDebtors;
