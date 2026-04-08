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
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.success) {
                    setProfile(res.data);
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="container"><div className="loading-spinner">Đang tải...</div></div>;

    return (
        <div className="container">
            <div className="page-header">
                <h2>Thông tin tài khoản</h2>
                <p>Quản lý thông tin cá nhân và bảo mật của bạn</p>
            </div>

            <div className="profile-wrapper">
                <div className="profile-sidebar">
                    <div className="profile-avatar-card">
                        <div className="avatar-wrapper">
                            <img src="/user.png" alt="avatar" className="avatar-img" />
                            <div className="status-indicator active"></div>
                        </div>
                        <h3 className="profile-name">{profile.fullName}</h3>
                        <p className="profile-role">{profile.roleName || 'Đoàn viên'}</p>

                        <div className="profile-badges">
                            {profile.isAdmin === 1 && <span className="badge admin-badge">Quản trị viên</span>}
                            <span className="badge unit-badge">{profile.unitBrand?.brand?.title || 'Khối'}</span>
                        </div>

                        <div className="profile-quick-info">
                            <div className="info-item">
                                <span className="icon">✉️</span>
                                <span>{profile.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="icon">🏢</span>
                                <span>{profile.unitBrand?.unit?.title || 'Chưa cập nhật'}</span>
                            </div>
                        </div>

                        <div className="profile-actions-sidebar">
                            <Link to={`/users/edit/${user?.userId}`} className="btn-edit-profile">
                                Chỉnh sửa thông tin
                            </Link>
                            <Link to="/profile/changepassword" className="btn-change-password">
                                Đổi mật khẩu
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="profile-main-content">
                    <div className="content-card">
                        <div className="card-header">
                            <h3>Chi tiết tài khoản</h3>
                        </div>
                        <div className="details-grid">
                            <div className="detail-group">
                                <label>Tên đăng nhập</label>
                                <div className="detail-value">{profile.userName}</div>
                            </div>
                            <div className="detail-group">
                                <label>Email</label>
                                <div className="detail-value">{profile.email}</div>
                            </div>
                            <div className="detail-group">
                                <label>CCCD/MSV</label>
                                <div className="detail-value">{profile.identifyCard || '---'}</div>
                            </div>
                            <div className="detail-group">
                                <label>Giới tính</label>
                                <div className="detail-value">{getGenderLabel(profile.gender)}</div>
                            </div>
                            <div className="detail-group">
                                <label>Ngày sinh</label>
                                <div className="detail-value">{formatDate(profile.birthDate) || '---'}</div>
                            </div>
                            <div className="detail-group">
                                <label>Ngày vào Đoàn</label>
                                <div className="detail-value">{formatDate(profile.joinDate) || '---'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
