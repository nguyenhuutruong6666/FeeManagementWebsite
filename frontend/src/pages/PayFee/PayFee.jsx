import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import './PayFee.scss';

const PayFee = () => {
    const { user } = useAuthStore();
    const [obligations, setObligations] = useState([]);
    

    useEffect(() => {
        const fetchObligations = async () => {

            setObligations([
                {
                    id: 1, policyName: 'Đoàn phí Học kỳ 1 2023-2024',
                    periodLabel: 'Học kỳ', dueDate: '2024-05-30', amount: 24000, referenceCode: 'OBL-91823'
                }
            ]);
        };
        fetchObligations();
    }, []);

    const user_role = user?.roleName;

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
                        const isOverdue = new Date(o.dueDate) < new Date();
                        return (
                            <div className="obligation-card" key={o.id}>
                                <div className="ob-details">
                                    <h3>
                                        <i className="ri-bill-line" style={{color: '#0ea5e9'}}></i> 
                                        {o.policyName}
                                        {isOverdue && <span className="status-badge" style={{background: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', padding: '2px 8px'}}>Quá hạn</span>}
                                    </h3>
                                    <p>Mã tham chiếu: <strong>{o.referenceCode}</strong></p>
                                    <p>Chu kỳ: <strong>{o.periodLabel}</strong></p>
                                    <p>Hạn nộp: <strong style={{color: isOverdue ? '#ef4444' : 'inherit'}}>{new Date(o.dueDate).toLocaleDateString('vi-VN')}</strong></p>
                                    <p style={{marginTop: '10px', fontSize: '1.1rem'}}>Số tiền thanh toán: <strong style={{color: '#10b981', fontSize: '1.2rem'}}>{new Intl.NumberFormat('vi-VN').format(o.amount)} đ</strong></p>
                                </div>
                                
                                <div className="ob-actions">
                                    <button type="button" className="btn-modern-primary" onClick={() => alert('Đang chuyển hướng VNPAY...')}>
                                        <i className="ri-bank-card-line"></i> Thanh toán trực tuyến
                                    </button>
                                    <button type="button" className="btn-modern-outline" onClick={() => alert('Đã báo cáo nộp bằng tiền mặt')}>
                                        <i className="ri-money-dollar-circle-line"></i> Nộp bằng tiền mặt
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
