import { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import { formatDate, getGenderLabel } from '../../utils/formatters';
import './Profile.scss';

const Profile = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Just use user context for now, or fetch from /auth/me for fresh data
        const fetchProfile = async () => {
            const res = await api.get('/auth/me');
            if (res.success) {
                setProfile(res.data);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="container">Đang tải...</div>;

    return (
        <div className="container">
            <h2>Thông tin tài khoản</h2>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">
                        <img src="/user.png" alt="avatar" style={{width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', background: '#e2e8f0'}} />
                    </div>
                    <div className="info">
                        <h3>{profile.fullName}</h3>
                        <p><b>Vai trò:</b> {profile.roleName || 'Chưa gán'}</p>
                        <p><b>Khối:</b> {profile.unitBrand?.brand?.title || 'Chưa cập nhật'}</p>
                        <p><b>Đơn vị:</b> {profile.unitBrand?.unit?.title || 'Chưa cập nhật'}</p>
                        <p><b>Trạng thái:</b> {profile.isAdmin === 1 ? 'Quản trị viên' : 'Hoạt động'}</p>
                    </div>
                </div>

                <div className="profile-body">
                    <table className="table profile-table">
                        <tbody>
                            <tr><th>Tên đăng nhập:</th><td>{profile.userName}</td></tr>
                            <tr><th>Họ và tên:</th><td>{profile.fullName}</td></tr>
                            <tr><th>Email:</th><td>{profile.email}</td></tr>
                            <tr><th>CCCD/MSV:</th><td>{profile.identifyCard}</td></tr>
                            <tr><th>Ngày sinh:</th><td>{formatDate(profile.birthDate)}</td></tr>
                            <tr><th>Giới tính:</th><td>{getGenderLabel(profile.gender)}</td></tr>
                            <tr><th>Ngày vào Đoàn:</th><td>{formatDate(profile.joinDate)}</td></tr>
                            <tr><th>Vai trò:</th><td>{profile.roleName}</td></tr>
                            <tr><th>Đơn vị:</th><td>{profile.unitBrand?.unit?.title}</td></tr>
                            <tr><th>Thuộc khối:</th><td>{profile.unitBrand?.brand?.title}</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="profile-footer">
                    <Link to={`/users/edit/${user?.userId}`} className="btn-edit">Chỉnh sửa thông tin</Link>
                    <Link to="/profile/changepassword" className="btn-delete">Đổi mật khẩu</Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
