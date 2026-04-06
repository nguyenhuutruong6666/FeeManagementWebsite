import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import './FeeCashbookSummary.scss';

const FeeCashbookSummary = () => {
    const { user } = useAuthStore();
    const user_role = user?.roleName;
    const unitName = user?.unitBrand?.unit?.title ? `${user.unitBrand.unit.title} (${user.unitBrand.brand?.title})` : 'Không xác định';
    const current_balance = 1500000; // Mock data

    const transactions = [
        { id: 1, fullName: 'Nguyễn Văn A', period_label: 'Học kỳ 1 2023-2024', amount: 24000, updated_at: '2024-05-15T10:30:00Z' }
    ];

    return (
        <div className="container">
            <h2>Quản lý Sổ quỹ đoàn phí</h2>
            
            <div className="action-buttons" style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
                <Link to="/feecashbooksummary/approve" className="btn btn-approve" style={{background: '#0984e3'}}>Phê duyệt kỳ thu phí</Link>
                {['BCH Chi đoàn', 'BCH Khoa'].includes(user_role) && (
                    <Link to="/feecashbooksummary/transfer" className="btn btn-transfer" style={{background: '#27ae60'}}>Phân bổ & Chuyển nộp</Link>
                )}
            </div>

            <div className="summary-box" style={{background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
                <h3 style={{margin: '0 0 10px 0', color: '#2d3436'}}>Đơn vị: {unitName}</h3>
                <p><strong>Cấp quản lý:</strong> {user_role || 'Chưa rõ'}</p>
                <div className="balance-card" style={{marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '5px solid #00b894'}}>
                    <h4 style={{margin: '0 0 5px 0', color: '#636e72'}}>Tổng số dư hiện tại ( Đã được duyệt )</h4>
                    <div className="balance-amount" style={{fontSize: '24px', fontWeight: 'bold', color: '#00b894'}}>
                        {new Intl.NumberFormat('vi-VN').format(current_balance)}đ
                    </div>
                </div>
            </div>

            <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #eee'}} />
            
            <h3 style={{marginBottom: '15px'}}>Danh sách đoàn viên đã nộp gần nhất</h3>
            <div className="table-wrapper">
                <table className="table data-table">
                    <thead>
                        <tr>
                            <th>Họ tên</th>
                            <th>Kỳ thu phí</th>
                            <th>Số tiền</th>
                            <th>Ngày nộp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.fullName}</td>
                                <td>{t.period_label}</td>
                                <td style={{color: '#27ae60', fontWeight: 'bold'}}>{new Intl.NumberFormat('vi-VN').format(t.amount)}đ</td>
                                <td>{formatDate(t.updated_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeeCashbookSummary;
