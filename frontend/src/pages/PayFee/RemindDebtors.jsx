import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../components/Common/ToastNotification';

const RemindDebtors = () => {
    const { toast } = useToast();
    const [obligations, setObligations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUnpaid = async () => {
        try {
            const res = await api.get('/fee-obligations/unpaid');
            if (res.success) {
                setObligations(res.data);
            }
        } catch (err) {
            toast.error('Lỗi khi tải danh sách nợ phí');
        }
    };

    useEffect(() => {
        fetchUnpaid();
    }, []);

    const handleRemind = async (ids) => {
        if (!ids || ids.length === 0) return;
        setLoading(true);
        try {
            const res = await api.post('/fee-obligations/remind', { obligationIds: ids });
            if (res.success) {
                toast.success(res.message || 'Đã gửi email nhắc nhở thành công!');
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi khi gửi nhắc nợ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Nhắc nợ Đoàn viên chưa nộp</h2>
                <p>Kiểm soát danh sách các cá nhân chưa hoàn thành nghĩa vụ phí để gửi thông báo đôn đốc kịp thời.</p>
            </div>
            
            <div className="data-table-card">
                <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between'}}>
                    <button 
                        className="btn-modern-outline" 
                        style={{width: 'auto', borderColor: '#eab308', color: '#ca8a04'}} 
                        onClick={() => handleRemind(obligations.map(o => o.id))}
                        disabled={loading || obligations.length === 0}
                    >
                        <i className="ri-mail-send-line"></i> {loading ? 'Đang gửi...' : 'Gửi thông báo tự động tới Tất cả'}
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
                            {obligations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>Không có đoàn viên nào nợ phí</td>
                                </tr>
                            ) : obligations.map(obl => (
                                <tr key={obl.id}>
                                    <td style={{fontWeight: '600', color: '#0f172a'}}>{obl.user?.fullName}</td>
                                    <td>{obl.periodLabel}</td>
                                    <td style={{fontWeight: '600', color: '#ef4444'}}>{new Intl.NumberFormat('vi-VN').format(obl.amount)} đ</td>
                                    <td style={{fontWeight: '600', color: '#eab308'}}>{formatDate(obl.dueDate)}</td>
                                    <td>
                                        <button 
                                            className="btn-modern-primary" 
                                            style={{padding: '6px 12px'}} 
                                            onClick={() => handleRemind([obl.id])}
                                            disabled={loading}
                                        >
                                            <i className="ri-send-plane-line"></i> Nhắc riêng
                                        </button>
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

export default RemindDebtors;
