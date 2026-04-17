import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import './FeeCashbookSummary.scss';

const FeeCashbookSummary = () => {
    const { user } = useAuthStore();
    const user_role = user?.roleName;
    const unitName = user?.unitBrand?.unit?.title ? `${user.unitBrand.unit.title} (${user.unitBrand.brand?.title})` : 'Không xác định';
    const current_balance = 1500000;

    const transactions = [
        { id: 1, fullName: 'Nguyễn Văn A', period_label: 'Học kỳ 1 2023-2024', amount: 24000, updated_at: '2024-05-15T10:30:00Z' }
    ];

    return (
        <div className="container">
            <div className="page-header">
                <h2>Quản lý Sổ quỹ Đoàn phí</h2>
                <p>Theo dõi luồng tiền thu chi và phê duyệt các khoản nộp/chuyển cấp dưới.</p>
            </div>
            
            <div className="action-toolbar">
                <Link to="/feecashbooksummary/approve" className="btn-toolbar primary">
                    <i className="ri-check-double-line"></i> Phê duyệt khoản thu
                </Link>
                {['BCH Chi đoàn', 'BCH Khoa'].includes(user_role) && (
                    <Link to="/feecashbooksummary/transfer" className="btn-toolbar success">
                        <i className="ri-arrow-left-right-line"></i> Phân bổ & Chuyển nộp
                    </Link>
                )}
            </div>

            <div className="cashbook-header-card">
                <div className="unit-info">
                    <h3><i className="ri-building-4-line" style={{color: '#64748b'}}></i> {unitName}</h3>
                    <p>Cấp quản lý hệ thống: <strong>{user_role || 'Chưa rõ'}</strong></p>
                </div>
                
                <div className="balance-badge">
                    <h4>Tổng số dư (Đã duyệt)</h4>
                    <p className="amount">{new Intl.NumberFormat('vi-VN').format(current_balance)} đ</p>
                </div>
            </div>

            <div className="data-table-card">
                <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.1rem', color: '#0f172a'}}>Danh sách đoàn viên nộp gần nhất</h3>
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Kỳ thu phí</th>
                                <th>Số tiền</th>
                                <th>Ngày nộp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? transactions.map(t => (
                                <tr key={t.id}>
                                    <td style={{fontWeight: '600', color: '#0f172a'}}>{t.fullName}</td>
                                    <td>{t.period_label}</td>
                                    <td style={{color: '#10b981', fontWeight: 'bold'}}>{new Intl.NumberFormat('vi-VN').format(t.amount)} đ</td>
                                    <td>{formatDate(t.updated_at)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>Chưa có giao dịch nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeCashbookSummary;
