import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import './ActivityManagement.scss';

const ActivityManagement = () => {
    const { user } = useAuthStore();
    const user_role = user?.roleName;

    return (
        <div className="container">
            <h1 style={{color: '#2d3436', marginBottom: '25px'}}>Quản lý hoạt động</h1>
            
            <div className="actions" style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                {['BCH Chi đoàn', 'BCH Khoa', 'BCH Trường'].includes(user_role) && (
                    <Link to="/activitymanagement/proposal" className="btn-action propose-action">
                        Đề xuất hoạt động
                    </Link>
                )}
                
                {['BCH Khoa', 'BCH Trường'].includes(user_role) && (
                    <Link to="/activitymanagement/approval" className="btn-action approve-action">
                        Phê duyệt hoạt động
                    </Link>
                )}
                
                {['BCH Trường'].includes(user_role) && (
                    <Link to="/activitymanagement/disbursement" className="btn-action propose-action" style={{background: 'linear-gradient(135deg, #00b894, #55efc4)'}}>
                        Xuất phiếu chi
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ActivityManagement;
