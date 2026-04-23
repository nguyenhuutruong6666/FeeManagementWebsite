import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../components/Common/ToastNotification';

const ConfirmCashPayment = () => {
    const { toast } = useToast();
    const [payments, setPayments] = useState([]);

    const fetchPendingPayments = async () => {
        try {
            const res = await api.get('/fee-payments', { status: 'Pending', method: 'Cash' });
            if (res.success) {
                setPayments(res.data);
            }
        } catch (err) {
            toast.error('Lỗi khi tải danh sách chờ xác nhận');
        }
    };

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const handleConfirm = async (paymentId) => {
        try {
            const res = await api.post('/fee-payments/confirm-cash', { paymentId });
            if (res.success) {
                toast.success('Đã xác nhận thu tiền mặt thành công!');
                fetchPendingPayments();
            }
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra khi xác nhận');
        }
    };

    const handleReject = async (paymentId) => {
        try {
            const res = await api.post('/fee-payments/reject-cash', { paymentId });
            if (res.success) {
                toast.success('Đã từ chối khoản thu tiền mặt này!');
                fetchPendingPayments();
            }
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra khi hủy bỏ');
        }
    };

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
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>Không có khoản thu tiền mặt nào đang chờ xác nhận</td>
                                </tr>
                            ) : payments.map(payment => (
                                <tr key={payment.id}>
                                    <td style={{fontWeight: '600', color: '#0f172a'}}>{payment.payer?.fullName}</td>
                                    <td><span className="status-badge" style={{background: '#f1f5f9', color: '#475569'}}>{payment.transactionCode}</span></td>
                                    <td style={{fontWeight: '600', color: '#10b981'}}>{new Intl.NumberFormat('vi-VN').format(payment.amount)} đ</td>
                                    <td>
                                        <div className="btn-actions">
                                            <button className="btn-activate" onClick={() => handleConfirm(payment.id)}>Xác nhận thu</button>
                                            <button className="btn-delete" onClick={() => handleReject(payment.id)}>Hủy bỏ</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
