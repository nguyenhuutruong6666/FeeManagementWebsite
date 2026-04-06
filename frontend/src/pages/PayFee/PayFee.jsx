import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import './PayFee.scss';

const PayFee = () => {
    const { user } = useAuthStore();
    const [obligations, setObligations] = useState([]);
    
    // In a real flow, use useEffect to fetch from /api/members/me/obligations
    useEffect(() => {
        const fetchObligations = async () => {
            // Mock data representing the UI
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
            <h2>Nghĩa vụ đoàn phí của bạn</h2>
            
            {['BCH Chi đoàn'].includes(user_role) || user?.isAdmin === 1 ? (
                <div style={{textAlign: 'right', marginBottom: '15px'}}>
                    <Link to="/pay-fee/confirm" className="btn-manage" style={{marginRight: '10px'}}>Trang xác nhận tiền mặt (BCH)</Link>
                    <Link to="/pay-fee/remind" className="btn-remind">Nhắc nợ đoàn viên</Link>
                </div>
            ) : null}

            {obligations.length > 0 ? (
                <div className="obligation-list">
                    {obligations.map(o => {
                        const isOverdue = new Date(o.dueDate) < new Date();
                        return (
                            <div className="obligation-card" key={o.id}>
                                <h3>{o.policyName}</h3>
                                <p>Chu kỳ: <strong>{o.periodLabel}</strong></p>
                                <p>
                                    Hạn nộp: {new Date(o.dueDate).toLocaleDateString('vi-VN')}
                                    {isOverdue && <span className="overdue">⚠️ Bạn đã quá hạn nộp</span>}
                                </p>
                                <p>Số tiền: <strong>{new Intl.NumberFormat('vi-VN').format(o.amount)}đ</strong></p>
                                <p>Mã tham chiếu: <strong>{o.referenceCode}</strong></p>
                                
                                <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
                                    <div className="payment-buttons">
                                        <button type="button" className="btn-cash" onClick={() => alert('Đã ghi nhận đóng tiền mặt')}>Nộp tiền mặt</button>
                                        <button type="button" className="btn-qr" onClick={() => alert('Đang chuyển hướng VNPAY...')}>Thanh toán VNPay</button>
                                    </div>
                                </form>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>Bạn không còn nghĩa vụ nào cần nộp.</p>
            )}
        </div>
    );
};

export default PayFee;
