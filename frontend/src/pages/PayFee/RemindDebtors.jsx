import { Link } from 'react-router-dom';
import { useToast } from '../../components/Common/ToastNotification';

const RemindDebtors = () => {
    const { toast } = useToast();

    return (
        <div className="container">
            <div className="page-header">
                <h2>Nhắc nợ Đoàn viên chưa nộp</h2>
                <p>Kiểm soát danh sách các cá nhân chưa hoàn thành nghĩa vụ phí để gửi thông báo đôn đốc kịp thời.</p>
            </div>
            
            <div className="data-table-card">
                <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between'}}>
                    <button className="btn-modern-outline" style={{width: 'auto', borderColor: '#eab308', color: '#ca8a04'}} onClick={() => toast.success('Đã tự động gửi email nhắc nhở tới tất cả đoàn viên chưa nộp!')}>
                        <i className="ri-mail-send-line"></i> Gửi thông báo tự động tới Tất cả
                    </button>
                </div>
                
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Kỳ phí nợ</th>
                                <th>Số tiền</th>
                                <th>Hạn nộp</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{fontWeight: '600', color: '#0f172a'}}>Lê Thị C</td>
                                <td>HK1/2025</td>
                                <td style={{fontWeight: '600', color: '#ef4444'}}>24.000 đ</td>
                                <td style={{fontWeight: '600', color: '#eab308'}}>30/05/2024</td>
                                <td>
                                    <button className="btn-modern-primary" style={{padding: '6px 12px'}} onClick={() => toast.success('Đã gửi email nhắc nhở riêng cho sinh viên này.')}>
                                        <i className="ri-send-plane-line"></i> Nhắc riêng
                                    </button>
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

export default RemindDebtors;
