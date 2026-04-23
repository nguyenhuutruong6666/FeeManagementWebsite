import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const Disbursement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activities, setActivities] = useState([]);
    const [formData, setFormData] = useState({
        activityId: '',
        amount: '',
        description: ''
    });

    useEffect(() => {
        const fetchApproved = async () => {
            try {
                const res = await api.get('/activities');
                if (res.success) {
                    // Get only approved activities that haven't been disbursed yet
                    const approved = res.data.filter(a => a.status === 'approved');
                    setActivities(approved);
                }
            } catch (err) {
                toast.error('Lỗi khi tải danh sách hoạt động');
            }
        };
        fetchApproved();
    }, [toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Auto-fill amount if activity is selected
        if (name === 'activityId') {
            const selected = activities.find(a => a.id.toString() === value);
            if (selected) {
                setFormData(prev => ({ ...prev, amount: selected.approvedBudget || selected.estimatedBudget }));
            } else {
                setFormData(prev => ({ ...prev, amount: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!formData.activityId || !formData.amount) {
            return toast.error('Vui lòng điền đủ thông tin');
        }

        try {
            const res = await api.post('/fee-cashbooks/expense', {
                activityId: formData.activityId,
                amount: formData.amount,
                description: formData.description
            });
            if (res.success) {
                toast.success('Hệ thống đã ghi nhận lập phiếu chi xuất quỹ thành công!');
                navigate('/activitymanagement');
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi lập phiếu chi');
        }
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
                        <select name="activityId" value={formData.activityId} onChange={handleChange} required>
                            <option value="">-- Chọn danh mục hoạt động --</option>
                            {activities.map(a => (
                                <option key={a.id} value={a.id}>{a.title} - {new Intl.NumberFormat('vi-VN').format(a.approvedBudget || a.estimatedBudget)}đ</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Số tiền thực chi (VNĐ):</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Ghi chú chi:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Nhập lý do chi tiết (nếu có)..."></textarea>
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
