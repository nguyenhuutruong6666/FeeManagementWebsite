import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import './UserForm.scss';

const EditUser = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams();
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const fetchInitialInfo = async () => {
            try {
                const resUnits = await api.get('/units/brands');
                if (resUnits.success) setUnits(resUnits.data);

                const resUser = await api.get(`/users/${id}`);
                if (resUser.success) {
                    const u = resUser.data;
                    setFormData({
                        userName: u.userName,
                        fullName: u.fullName,
                        email: u.email,
                        identifyCard: u.identifyCard || '',
                        gender: u.gender ?? '',
                        birthDate: u.birthDate ? u.birthDate.split('T')[0] : '',
                        joinDate: u.joinDate ? u.joinDate.split('T')[0] : '',
                        unitId: u.unitId || '',
                        roleName: u.roleName || 'Đoàn viên',
                        isAdmin: u.isAdmin,
                        password: ''
                    });
                }
            } catch (e) {
                alert('Lỗi tải dữ liệu người dùng');
                if (user?.isAdmin === 1) navigate('/users');
                else navigate('/profile');
            }
        };
        if (id) {
            fetchInitialInfo();
        }
    }, [id, navigate, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/users/${id}`, formData);
            if (res.success) {
                alert('Cập nhật thông tin thành công!');

                if (user?.isAdmin === 1) navigate('/users');
                else navigate('/profile');
            }
        } catch (error) {
            alert(error.message || 'Cập nhật thất bại.');
        }
    };

    if (!formData) return <div className="container">Đang tải...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h2>{user?.isAdmin === 1 && user?.userId !== Number(id) ? 'Cập nhật thông tin Người dùng' : 'Chỉnh sửa thông tin cá nhân'}</h2>
                <p>Cập nhật chính xác dữ liệu của bạn trong hệ thống</p>
            </div>

            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-section-title">Thông tin cơ bản</div>
                        <div className="form-group-modern">
                            <label>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group-modern">
                            <label>Tên đăng nhập / Bí danh</label>
                            <input type="text" value={formData.userName} disabled />
                        </div>
                        <div className="form-group-modern">
                            <label>Địa chỉ Email <span style={{ color: 'red' }}>*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group-modern">
                            <label>MSV/CCCD</label>
                            <input type="text" name="identifyCard" value={formData.identifyCard} onChange={handleChange} />
                        </div>
                        <div className="form-group-modern">
                            <label>Giới tính</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">-- Chưa rõ --</option>
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                        <div className="form-group-modern">
                            <label>Ngày sinh</label>
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                        </div>
                        <div className="form-group-modern">
                            <label>Ngày vào Đoàn</label>
                            <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
                        </div>

                        <div className="form-section-title">Thông tin tổ chức & Phân quyền</div>
                        {user?.isAdmin === 1 ? (
                            <div className="form-group-modern">
                                <label>Đơn vị <span style={{ color: 'red' }}>*</span></label>
                                <select name="unitId" required value={formData.unitId} onChange={handleChange}>
                                    <option value="">-- Chọn đơn vị --</option>
                                    {units.map(u => (
                                        <option key={u.id} value={u.unit?.id}>{u.unit?.title} ({u.brand?.title})</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="form-group-modern">
                                <label>Đơn vị (Chỉ Admin mới có quyền sửa)</label>
                                <input type="text" value={formData.unitId ? units.find(u => u.unit?.id === formData.unitId)?.unit?.title || formData.unitId : 'Đang xử lý'} disabled />
                            </div>
                        )}

                        {user?.isAdmin === 1 ? (
                            <div className="form-group-modern">
                                <label>Vai trò</label>
                                <select name="roleName" value={formData.roleName} onChange={handleChange}>
                                    <option value="Quản trị viên">Quản trị viên (Admin)</option>
                                    <option value="BCH Trường">BCH Trường</option>
                                    <option value="BCH Khoa">BCH Khoa</option>
                                    <option value="BCH Chi đoàn">BCH Chi đoàn</option>
                                    <option value="Đoàn viên">Đoàn viên</option>
                                </select>
                                {formData.roleName === 'Quản trị viên' && <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '5px' }}>⚠️ Cấu hình Admin hệ thống</p>}
                            </div>
                        ) : (
                            <div className="form-group-modern">
                                <label>Vai trò (Chỉ Admin mới có quyền sửa)</label>
                                <input type="text" value={formData.roleName} disabled />
                            </div>
                        )}

                        <div className="form-section-title">Bảo mật</div>
                        <div className="form-group-modern" style={{ gridColumn: '1 / -1' }}>
                            <label>Mật khẩu mới</label>
                            <input type="password" name="password" placeholder="Bỏ trống nếu không thay đổi..." value={formData.password} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-actions-modern">
                        <Link to={user?.isAdmin === 1 ? `/users` : `/profile`} className="btn-back-modern">Quay lại</Link>
                        <button type="submit" className="btn-save">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
