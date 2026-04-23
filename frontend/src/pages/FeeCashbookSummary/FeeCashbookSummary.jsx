import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './FeeCashbookSummary.scss';
import { useToast } from '../../components/Common/ToastNotification';

const FeeCashbookSummary = () => {
    const { user } = useAuthStore();
    const user_role = user?.roleName;
    const unitName = user?.unitBrand?.unit?.title ? `${user.unitBrand.unit.title} (${user.unitBrand.brand?.title})` : 'Không xác định';
    
    const [transactions, setTransactions] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCashbooks = async () => {
            try {
                const res = await api.get('/fee-cashbooks');
                if (res.success) {
                    const data = res.data || [];
                    setTransactions(data);
                    
                    const balance = data.reduce((acc, curr) => {
                        return curr.transactionType === 'income' 
                            ? acc + curr.amount 
                            : acc - curr.amount;
                    }, 0);
                    setCurrentBalance(balance);
                }
            } catch (err) {
                toast.error('Lỗi khi tải dữ liệu sổ quỹ');
            }
        };
        fetchCashbooks();
    }, [toast]);

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
                    <p className="amount">{new Intl.NumberFormat('vi-VN').format(currentBalance)} đ</p>
                </div>
            </div>

            <div className="data-table-card">
                <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.1rem', color: '#0f172a'}}>Lịch sử Thu/Chi Sổ quỹ</h3>
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Ngày giao dịch</th>
                                <th>Loại giao dịch</th>
                                <th>Hạng mục</th>
                                <th>Số tiền (VNĐ)</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? transactions.map(t => (
                                <tr key={t.id}>
                                    <td>{formatDate(t.transactionDate)}</td>
                                    <td>
                                        <span className={`status-badge ${t.transactionType === 'income' ? 'success' : 'danger'}`}>
                                            {t.transactionType === 'income' ? 'Thu' : 'Chi'}
                                        </span>
                                    </td>
                                    <td style={{fontWeight: '500', color: '#0f172a'}}>{t.transactionCategory}</td>
                                    <td style={{color: t.transactionType === 'income' ? '#10b981' : '#ef4444', fontWeight: 'bold'}}>
                                        {t.transactionType === 'income' ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(t.amount)} đ
                                    </td>
                                    <td>{t.description || '-'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>Chưa có giao dịch nào trong sổ quỹ</td>
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
