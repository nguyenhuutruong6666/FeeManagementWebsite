import { Link, useNavigate } from 'react-router-dom';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const ApproveFeePeriod = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleAction = (type) => {
        if (type === 'approve') {
            toast.success('Đã duyệt báo cáo nộp phí thành công!');
        } else {
            toast.error('Đã từ chối báo cáo nộp phí!');
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
                
                <div style={{border: '1px solid #e2e8f0', padding: '20px', borderRadius: '10px', background: '#f8fafc', marginBottom: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                        <h4 style={{margin: 0, color: '#0f172a'}}>Chi đoàn K72E1</h4>
                        <span className="status-badge" style={{background: '#ffedd5', color: '#c2410c'}}>Chờ duyệt</span>
                    </div>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.95rem'}}>
                        <div>
                            <p style={{margin: '0 0 5px 0', color: '#64748b'}}>Tổng tiền thu được:</p>
                            <p style={{margin: 0, fontWeight: '600', color: '#0f172a'}}>2.400.000 đ</p>
                        </div>
                        <div>
                            <p style={{margin: '0 0 5px 0', color: '#64748b'}}>Số tiền trích nộp (40%):</p>
                            <p style={{margin: 0, fontWeight: '600', color: '#0284c7', fontSize: '1.1rem'}}>960.000 đ</p>
                        </div>
                    </div>
                    
                    <div style={{marginTop: '20px', display: 'flex', gap: '10px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1'}}>
                         <button style={{padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}} onClick={() => handleAction('approve')}><i className="ri-check-line"></i> Duyệt ngay</button>
                         <button style={{padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}} onClick={() => handleAction('reject')}><i className="ri-close-line"></i> Từ chối</button>
                    </div>
                </div>
                
                <div className="form-actions-modern">
                    <Link to="/feecashbooksummary" className="btn-back-modern">Quay về Sổ quỹ</Link>
                </div>
            </div>
        </div>
    );
};

export default ApproveFeePeriod;
