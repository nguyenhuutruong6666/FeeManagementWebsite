import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const ActivityProposal = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuthStore();
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        estimatedBudget: '',
        expectedDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const res = await api.post('/activities', {
                ...formData,
                unitId: user?.unitId
            });
            if (res.success) {
                toast.success('Gửi đề xuất hoạt động thành công! Đang chờ duyệt.');
                navigate('/activitymanagement');
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi khi gửi đề xuất');
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Đề xuất Hoạt động mới</h2>
                <p>Khởi tạo hồ sơ sự kiện và đính kèm dự trù kinh phí để trình lên cấp quản lý.</p>
            </div>
            
            <div className="policy-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modern">
                        <label>Tên hoạt động:</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Nhập tên phong trào/chương trình..." required />
                    </div>
                    <div className="form-group-modern">
                        <label>Mô tả hoạt động:</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} required rows="4" placeholder="Mục đích, quy mô, thời gian..."></textarea>
                    </div>
                    <div className="form-group-modern">
                        <label>Ngày dự kiến tổ chức:</label>
                        <input type="date" name="expectedDate" value={formData.expectedDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group-modern">
                        <label>Kinh phí dự kiến (VNĐ):</label>
                        <input type="number" name="estimatedBudget" value={formData.estimatedBudget} onChange={handleChange} placeholder="Ví dụ: 1000000" required />
                    </div>
                    <div className="form-group-modern">
                        <label>Tải lên File đính kèm (Kế hoạch chi tiết):</label>
                        <input type="file" style={{background: 'white'}} />
                        <small style={{color: '#64748b'}}>* Tính năng upload file tạm thời bỏ qua trong bản demo này.</small>
                    </div>
                    
                    <div className="form-actions-modern">
                        <Link to="/activitymanagement" className="btn-back-modern">Hủy</Link>
                        <button type="submit" className="btn-save"><i className="ri-send-plane-fill"></i> Trình duyệt Đề xuất</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityProposal;
