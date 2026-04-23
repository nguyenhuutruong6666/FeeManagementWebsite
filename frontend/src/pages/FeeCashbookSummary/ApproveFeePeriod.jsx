import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const ApproveFeePeriod = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuthStore();
    const [distributions, setDistributions] = useState([]);

    const fetchPending = async () => {
        try {
            const res = await api.get('/fee-distributions');
            if (res.success) {
                // Filter to get only distributions sent to THIS user's unit
                const pending = res.data.filter(d => 
                    d.transferUnitId === user?.unitId && 
                    (d.status === 'pending' || d.status === 'transferred')
                );
                setDistributions(pending);
            }
        } catch (err) {
            toast.error('Lỗi khi tải danh sách chờ duyệt');
        }
    };

    useEffect(() => {
        if (user?.unitId) {
            fetchPending();
        }
    }, [user]);

    const handleAction = async (id, type) => {
        try {
            const res = await api.put(`/fee-distributions/${id}/${type}`);
            if (res.success) {
                if (type === 'approve') {
                    toast.success('Đã duyệt báo cáo nộp phí thành công và cộng vào sổ quỹ!');
                } else {
                    toast.success('Đã từ chối báo cáo nộp phí!');
                }
                fetchPending();
            }
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Phê duyệt Khoản thu cấp dưới</h2>
                <p>Xem xét và chấp nhận các báo cáo thu, phân bổ Đoàn phí từ các đơn vị trực thuộc.</p>
            </div>
            
            <div className="policy-form-wrapper" style={{maxWidth: '700px'}}>
                <h3 style={{marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}><i className="ri-file-list-3-line"></i> Danh sách chờ duyệt</h3>
                
                {distributions.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>Không có khoản thu nào đang chờ duyệt.</div>
                ) : distributions.map(d => (
                    <div key={d.id} style={{border: '1px solid #e2e8f0', padding: '20px', borderRadius: '10px', background: '#f8fafc', marginBottom: '20px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                            <h4 style={{margin: 0, color: '#0f172a'}}>{d.unitBrand?.unit?.title || 'Đơn vị ẩn danh'} - {d.periodLabel}</h4>
                            <span className="status-badge" style={{background: '#ffedd5', color: '#c2410c'}}>Chờ duyệt</span>
                        </div>
                        
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.95rem'}}>
                            <div>
                                <p style={{margin: '0 0 5px 0', color: '#64748b'}}>Tổng tiền thu được:</p>
                                <p style={{margin: 0, fontWeight: '600', color: '#0f172a'}}>{new Intl.NumberFormat('vi-VN').format(d.totalAmount)} đ</p>
                            </div>
                            <div>
                                <p style={{margin: '0 0 5px 0', color: '#64748b'}}>Số tiền trích nộp lên:</p>
                                <p style={{margin: 0, fontWeight: '600', color: '#0284c7', fontSize: '1.1rem'}}>{new Intl.NumberFormat('vi-VN').format(d.transferAmount)} đ</p>
                            </div>
                        </div>
                        
                        <div style={{marginTop: '20px', display: 'flex', gap: '10px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1'}}>
                            <button style={{padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}} onClick={() => handleAction(d.id, 'approve')}><i className="ri-check-line"></i> Duyệt ngay</button>
                            <button style={{padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}} onClick={() => handleAction(d.id, 'reject')}><i className="ri-close-line"></i> Từ chối</button>
                        </div>
                    </div>
                ))}
                
                <div className="form-actions-modern">
                    <Link to="/feecashbooksummary" className="btn-back-modern">Quay về Sổ quỹ</Link>
                </div>
            </div>
        </div>
    );
};

export default ApproveFeePeriod;
