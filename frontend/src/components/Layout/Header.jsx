import useAuthStore from '../../store/authStore';

const Header = () => {
    const { user } = useAuthStore();

    return (
        <header className="header">
            <div className="header-left">
                <div>
                    <img src="/hnue.png" alt="logo" /> {/* Adjust path as needed */}
                </div>
                <h2>HỆ THỐNG QUẢN LÝ ĐOÀN PHÍ</h2>
            </div>
            <div className="header-right">
                {user && (
                    <span>Xin chào, <b>{user.fullName}</b></span>
                )}
            </div>
        </header>
    );
};

export default Header;
