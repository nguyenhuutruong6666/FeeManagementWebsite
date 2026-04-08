import { Link } from 'react-router-dom';
import { useToast } from '../../components/Common/ToastNotification';

const ConfirmCashPayment = () => {
    const { toast } = useToast();

    return (
        <div className="container">
            <div className="page-header">
                <h2>BCH Xác nhận nộp tiền mặt</h2>
                <p>Những khoản tiền mặt Đoàn viên đã báo cáo đóng sẽ hiện ở đây để BCH xác thực đã nhận đủ tiền.</p>
            </div>
            
            <div className="data-table-card">
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Đoàn viên</th>
                                <th>Mã giao dịch</th>
                                <th>Số tiền</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{fontWeight: '600', color: '#0f172a'}}>Nguyễn Văn B</td>
                                <td><span className="status-badge" style={{background: '#f1f5f9', color: '#475569'}}>TXN-1A2B3C</span></td>
                                <td style={{fontWeight: '600', color: '#10b981'}}>24.000 đ</td>
                                <td>
                                    <div className="btn-actions">
                                        <button className="btn-activate" onClick={() => toast.success('Đã xác nhận thu tiền mặt thành công!')}>Xác nhận thu</button>
                                        <button className="btn-delete" onClick={() => toast.error('Đã từ chối khoản thu tiền mặt này!')}>Hủy bỏ</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
                    <Link to="/payfee" className="btn-modern-outline" style={{width: 'auto'}}><i className="ri-arrow-left-line"></i> Quay về</Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCashPayment;
