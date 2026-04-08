import { Link, useNavigate } from 'react-router-dom';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const Disbursement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault(); 
        toast.success('Hệ thống đã ghi nhận lập phiếu chi xuất quỹ thành công!');
        navigate('/activitymanagement');
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Lập Phiếu chi (Giải ngân)</h2>
                <p>Khấu trừ nguồn quỹ của tổ chức và xuất biên lai giải ngân cho các hoạt động đã được cấp phép.</p>
            </div>
            
            <div className="policy-form-wrapper" style={{maxWidth: '600px'}}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modern">
                        <label>Chọn sự kiện / hoạt động (Đã được duyệt):</label>
                        <select required>
                            <option value="">-- Chọn danh mục hoạt động --</option>
                            <option value="1">Đại hội Chi đoàn - 500.000đ</option>
                        </select>
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Số tiền thực chi (VNĐ):</label>
                        <input type="number" required defaultValue="500000" />
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Ghi chú chi:</label>
                        <textarea rows="3" placeholder="Nhập lý do chi tiết (nếu có)..."></textarea>
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Mã tra cứu phiếu chi (Auto):</label>
                        <input type="text" value={`PC-${new Date().getTime()}`} disabled style={{background: '#f1f5f9', color: '#64748b', fontWeight: 'bold'}} />
                    </div>
                    
                    <div className="form-actions-modern">
                        <Link to="/activitymanagement" className="btn-back-modern">Quay về</Link>
                        <button type="submit" className="btn-save" style={{background: '#15803d'}}><i className="ri-printer-line"></i> Xuất Phiếu chi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Disbursement;
