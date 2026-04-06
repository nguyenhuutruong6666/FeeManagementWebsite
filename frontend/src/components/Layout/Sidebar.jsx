import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <nav className="sidebar">
            <ul>
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link>
                </li>
                {user?.isAdmin === 1 && (
                    <>
                        <li><Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>Quản lý người dùng</Link></li>
                        <li><Link to="/units" className={location.pathname === '/units' ? 'active' : ''}>Cấu hình tổ chức</Link></li>
                    </>
                )}
                
                {(user?.isAdmin === 1 || ['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'].includes(user?.roleName)) && (
                    <li><Link to="/members" className={location.pathname === '/members' ? 'active' : ''}>Quản lý đoàn viên</Link></li>
                )}
                
                {(user?.isAdmin === 1 || ['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'].includes(user?.roleName)) && (
                    <li><Link to="/manage-transactions" className={location.pathname === '/manage-transactions' ? 'active' : ''}>Quản lý giao dịch</Link></li>
                )}
                
                {['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'].includes(user?.roleName) && (
                    <li><Link to="/fee-cashbook-summary" className={location.pathname === '/fee-cashbook-summary' ? 'active' : ''}>Quản lý sổ quỹ</Link></li>
                )}

                {['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'].includes(user?.roleName) && (
                    <li><Link to="/activity-management" className={location.pathname === '/activity-management' ? 'active' : ''}>Quản lý hoạt động</Link></li>
                )}

                <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Thông tin tài khoản</Link></li>
            </ul>
            <div className="logout-container">
                <a href="/login" className="btn-logout" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 30 15" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: '5px'}}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Đăng xuất
                </a>
            </div>
        </nav>
    );
};

export default Sidebar;
