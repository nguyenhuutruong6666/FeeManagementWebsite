import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './Dashboard.scss';

const Dashboard = () => {
    const { user } = useAuthStore();
    const user_role = user?.roleName ?? '';

    return (
        <div className="container">
            <h1>Trang chính</h1>
            <p>Chào mừng {user?.fullName} đến với hệ thống quản lý đoàn phí!</p>

            <div className="actions">
                {user?.isAdmin !== 1 && (
                    <Link to="/pay-fee" className="btn-pay">Nộp đoàn phí</Link>
                )}

                {['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'].includes(user_role) && (
                    <Link to="/report-summary" className="btn-pay">Thống kê báo cáo</Link>
                )}

                {user?.isAdmin === 1 && (
                    <>
                        <Link to="/manage-transactions" className="btn-view">Xem giao dịch đoàn phí</Link>
                        <Link to="/policy-settings" className="btn-policy">Thiết lập chính sách đoàn phí</Link>
                        <Link to="/generate-fee-obligation" className="btn-policy">Sinh nghĩa vụ đoàn phí</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
