import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import './PayFee.scss';
import { useToast } from '../../components/Common/ToastNotification';

const PayFee = () => {
    const { user } = useAuthStore();
    const { toast } = useToast();
    const [obligations, setObligations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);

    useEffect(() => {
        fetchObligations();
    }, []);

    const fetchObligations = async () => {
        try {
            setLoading(true);
            const res = await api.get('/fee-obligations/my');
            if (res.success) {
                setObligations(res.data);
            }
        } catch (err) {
            toast.error(err.message || 'Không thể tải danh sách nghĩa vụ phí.');
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (obligation, method) => {
        setPayingId(obligation.id);
        try {
            const res = await api.post('/fee-payments', {
                obligationId: obligation.id,
                method,
                amount: Number(obligation.amount),
            });
            if (res.success) {
                if (method === 'VNPAY' && res.data?.paymentUrl) {
                    window.location.href = res.data.paymentUrl;
                } else {
                    toast.success(res.message || 'Đã ghi nhận yêu cầu nộp tiền mặt. Vui lòng nộp trực tiếp cho BCH.');
                    fetchObligations(); // Refresh danh sách
                }
            }
        } catch (err) {
            toast.error(err.message || 'Thanh toán thất bại. Vui lòng thử lại.');
        } finally {
            setPayingId(null);
        }
    };

    const user_role = user?.roleName;

    if (loading) {
        return (
            <div className="container">
                <div className="page-header">
                    <h2>Nghĩa vụ Đoàn phí của bạn</h2>
                </div>
                <div className="data-table-card" style={{textAlign: 'center', padding: '50px'}}>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header">
                <h2>Nghĩa vụ Đoàn phí của bạn</h2>
                <p>Xem danh sách các khoản phí cần nộp và thực hiện thanh toán trực tuyến dễ dàng.</p>
            </div>
            
            {(['BCH Chi đoàn', 'BCH Khoa', 'BCH Trường'].includes(user_role) || user?.isAdmin === 1) && (
                <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                    <Link to="/payfee/confirm" className="btn-modern-outline" style={{width: 'auto'}}>Xác nhận thu tiền mặt (BCH)</Link>
                    <Link to="/payfee/remind" className="btn-modern-outline" style={{width: 'auto', color: '#c2410c', borderColor: '#c2410c'}}>Nhắc nợ tự động</Link>
                </div>
            )}

            {obligations.length > 0 ? (
                <div className="obligation-list">
                    {obligations.map(o => {
                        const isOverdue = o.dueDate && new Date(o.dueDate) < new Date();
                        const isPaying = payingId === o.id;
                        return (
                            <div className="obligation-card" key={o.id}>
                                <div className="ob-details">
                                    <h3>
                                        <i className="ri-bill-line" style={{color: '#0ea5e9'}}></i>{' '}
                                        {o.policy?.policyName || 'Đoàn phí'}
                                        {isOverdue && <span className="status-badge" style={{background: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', padding: '2px 8px', marginLeft: '8px'}}>Quá hạn</span>}
                                    </h3>
                                    <p>Mã tham chiếu: <strong>{o.referenceCode}</strong></p>
                                    <p>Kỳ thu: <strong>{o.periodLabel}</strong></p>
                                    {o.dueDate && (
                                        <p>Hạn nộp: <strong style={{color: isOverdue ? '#ef4444' : 'inherit'}}>{new Date(o.dueDate).toLocaleDateString('vi-VN')}</strong></p>
                                    )}
                                    <p style={{marginTop: '10px', fontSize: '1.1rem'}}>
                                        Số tiền thanh toán:{' '}
                                        <strong style={{color: '#10b981', fontSize: '1.2rem'}}>{new Intl.NumberFormat('vi-VN').format(o.amount)} đ</strong>
                                    </p>
                                </div>
                                
                                <div className="ob-actions">
                                    <button
                                        type="button"
                                        className="btn-modern-primary"
                                        disabled={isPaying}
                                        onClick={() => handlePay(o, 'VNPAY')}
                                    >
                                        <i className="ri-bank-card-line"></i>{' '}
                                        {isPaying ? 'Đang xử lý...' : 'Thanh toán trực tuyến'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-modern-outline"
                                        disabled={isPaying}
                                        onClick={() => handlePay(o, 'Cash')}
                                    >
                                        <i className="ri-money-dollar-circle-line"></i>{' '}
                                        {isPaying ? 'Đang xử lý...' : 'Nộp bằng tiền mặt'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="data-table-card" style={{textAlign: 'center', padding: '50px'}}>
                    <i className="ri-check-double-line" style={{fontSize: '3rem', color: '#10b981', marginBottom: '15px'}}></i>
                    <h3>Tuyệt vời!</h3>
                    <p style={{color: '#64748b'}}>Bạn đã hoàn thành tất cả nghĩa vụ đoàn phí hiện có.</p>
                </div>
            )}
        </div>
    );
};

export default PayFee;
