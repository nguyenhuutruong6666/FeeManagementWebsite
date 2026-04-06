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

            <div className="dashboard-grid">
                {user?.isAdmin !== 1 && (
                    <div className="dashboard-card">
                        <div className="card-icon">💸</div>
                        <h3>Nộp đoàn phí</h3>
                        <p>Tra cứu và thanh toán nghĩa vụ đoàn phí của bạn.</p>
                        <Link to="/pay-fee" className="btn-action">Đi tới nộp phí</Link>
                    </div>
                )}

                {['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'].includes(user_role) && (
                    <div className="dashboard-card">
                        <div className="card-icon">📊</div>
                        <h3>Thống kê báo cáo</h3>
                        <p>Xem tổng quan thu chi và nợ phí của chi đoàn.</p>
                        <Link to="/report-summary" className="btn-action">Xem thống kê</Link>
                    </div>
                )}

                {user?.isAdmin === 1 && (
                    <>
                        <div className="dashboard-card">
                            <div className="card-icon">💳</div>
                            <h3>Giao dịch liên ngân hàng</h3>
                            <p>Đối soát giao dịch, cập nhật trạng thái thu.</p>
                            <Link to="/manage-transactions" className="btn-action">Xem giao dịch</Link>
                        </div>
                        <div className="dashboard-card">
                            <div className="card-icon">⚙️</div>
                            <h3>Chính sách hệ thống</h3>
                            <p>Quản lý kỳ thu, mức phí và luật giảm trừ.</p>
                            <Link to="/policy-settings" className="btn-action">Thiết lập chính sách</Link>
                        </div>
                        <div className="dashboard-card">
                            <div className="card-icon">📝</div>
                            <h3>Nghĩa vụ đoàn phí</h3>
                            <p>Tạo bảng thu phí và phát lệnh nộp phí tự động.</p>
                            <Link to="/generate-fee-obligation" className="btn-action">Sinh nghĩa vụ</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
