import { Link, useNavigate } from 'react-router-dom';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const AllocateTransfer = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault(); 
        toast.success('Đã tải lên UNC và tạo báo cáo chuyển nộp thành công!'); 
        navigate('/feecashbooksummary'); 
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Phân bổ & Thống kê Chuyển nộp</h2>
                <p>Khấu trừ tỷ lệ giữ lại của Đơn vị và tạo hồ sơ nộp khoản dư lên cấp trên.</p>
            </div>
            
            <div className="policy-form-wrapper" style={{maxWidth: '650px'}}>
                <div style={{marginBottom: '25px', padding: '20px', background: '#f8fafc', borderLeft: '4px solid #0ea5e9', borderRadius: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                        <span style={{color: '#64748b', fontSize: '0.95rem'}}>Tổng số thu thực tế đợt này:</span>
                        <strong style={{fontSize: '1.1rem', color: '#0f172a'}}>2.450.000 đ</strong>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px dashed #cbd5e1'}}>
                        <span style={{color: '#64748b', fontSize: '0.95rem'}}>Tỷ lệ được giữ lại sử dụng (60%):</span>
                        <strong style={{color: '#10b981'}}>1.470.000 đ</strong>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '15px'}}>
                        <span style={{color: '#0f172a', fontWeight: 'bold', fontSize: '1.05rem'}}>SỐ TIỀN PHẢI NỘP LÊN (40%):</span>
                        <strong style={{fontSize: '1.3rem', color: '#e11d48'}}>980.000 đ</strong>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modern">
                        <label>Số tiền đang chuyển nộp hệ thống:</label>
                        <input type="text" value="980.000 đ" disabled style={{background: '#f1f5f9', color: '#64748b', fontWeight: 'bold'}} />
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Tải lên chứng từ / Ủy nhiệm chi (PNG, JPG, PDF):</label>
                        <input type="file" required style={{padding: '8px 12px', background: 'white'}} />
                    </div>
                    
                    <div className="form-actions-modern">
                        <Link to="/feecashbooksummary" className="btn-back-modern">Quay lại</Link>
                        <button type="submit" className="btn-save"><i className="ri-upload-cloud-2-line"></i> Xác nhận Báo cáo nộp</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AllocateTransfer;
