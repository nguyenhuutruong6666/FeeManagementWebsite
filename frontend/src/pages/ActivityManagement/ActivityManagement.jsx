import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import '../Dashboard/Dashboard.scss';

const ActivityManagement = () => {
    const { user } = useAuthStore();
    const user_role = user?.roleName;

    return (
        <div className="container">
            <div className="page-header" style={{ marginBottom: '30px' }}>
                <h2>Quản lý Hoạt động & Nội bộ</h2>
                <p>Điều phối, xét duyệt và xuất quỹ cho các chương trình, phong trào của Đơn vị.</p>
            </div>
            
            <div className="dashboard-grid">
                {['BCH Chi đoàn', 'BCH Khoa', 'BCH Trường'].includes(user_role) && (
                    <div className="dashboard-card">
                        <div className="card-icon" style={{color: '#0ea5e9'}}><i className="ri-edit-circle-line"></i></div>
                        <h3>Đề xuất hoạt động</h3>
                        <p>Trình kế hoạch và dự trù kinh phí cho các chương trình sắp tới.</p>
                        <Link to="/activitymanagement/proposal" className="btn-action">Bắt đầu đề xuất</Link>
                    </div>
                )}
                
                {['BCH Khoa', 'BCH Trường'].includes(user_role) && (
                    <div className="dashboard-card">
                        <div className="card-icon" style={{color: '#8b5cf6'}}><i className="ri-todo-line"></i></div>
                        <h3>Phê duyệt hoạt động</h3>
                        <p>Xem xét, cấp phép cho các đề xuất từ đơn vị tuyến dưới.</p>
                        <Link to="/activitymanagement/approval" className="btn-action">Vào trang duyệt</Link>
                    </div>
                )}
                
                {['BCH Trường'].includes(user_role) && (
                    <div className="dashboard-card">
                        <div className="card-icon" style={{color: '#10b981'}}><i className="ri-safe-2-line"></i></div>
                        <h3>Xuất phiếu chi (Giải ngân)</h3>
                        <p>Thực hiện thao tác rút quỹ để phục vụ các hoạt động đã duyệt.</p>
                        <Link to="/activitymanagement/disbursement" className="btn-action" style={{background: '#10b981', borderColor: '#10b981', color: '#fff'}}>Tạo phiếu chi</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityManagement;
