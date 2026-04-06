import { useState } from 'react';
import { Link } from 'react-router-dom';

const ConfirmCashPayment = () => {
    return (
        <div className="container">
            <h2>BCH Xác nhận nộp tiền mặt</h2>
            <div style={{background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <p>Những khoản tiền mặt Đoàn viên đã báo cáo đóng sẽ hiện ở đây để BCH xác thực đã cầm tiền.</p>
                <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '15px'}}>
                        <thead>
                            <tr>
                                <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Đoàn viên</th>
                                <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Mã giao dịch</th>
                                <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Số tiền</th>
                                <th style={{border: '1px solid #ddd', padding: '10px', background: '#007bff', color: 'white'}}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>Nguyễn Văn B</td>
                                <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>TXN-1A2B3C</td>
                                <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>24.000đ</td>
                                <td style={{border: '1px solid #ddd', padding: '10px', textAlign: 'center'}}>
                                    <button style={{padding: '5px 10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px'}} onClick={() => alert('Xác nhận đã thu')}>Xác nhận thu</button>
                                    <button style={{padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}} onClick={() => alert('Hủy')}>Hủy</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{marginTop: '20px', textAlign: 'right'}}>
                    <Link to="/pay-fee" style={{padding: '8px 15px', background: '#6c757d', color: 'white', borderRadius: '6px', textDecoration: 'none'}}>Quay về</Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCashPayment;
