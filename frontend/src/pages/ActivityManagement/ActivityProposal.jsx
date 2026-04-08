import { Link, useNavigate } from 'react-router-dom';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const ActivityProposal = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault(); 
        toast.success('Gửi đề xuất hoạt động thành công! Đang chờ duyệt.');
        navigate('/activitymanagement');
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
                        <input type="text" placeholder="Nhập tên phong trào/chương trình..." required />
                    </div>
                    <div className="form-group-modern">
                        <label>Mô tả hoạt động:</label>
                        <textarea required rows="4" placeholder="Mục đích, quy mô, thời gian..."></textarea>
                    </div>
                    <div className="form-group-modern">
                        <label>Kinh phí dự kiến (VNĐ):</label>
                        <input type="number" placeholder="Ví dụ: 1000000" required />
                    </div>
                    <div className="form-group-modern">
                        <label>Tải lên File đính kèm (Kế hoạch chi tiết):</label>
                        <input type="file" required style={{background: 'white'}} />
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
