import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import './UserForm.scss';

const AddUser = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState({
        userName: '', fullName: '', email: '', identifyCard: '',
        gender: '', birthDate: '', joinDate: '', unitId: '', roleName: 'Đoàn viên', password: '123456'
    });

    useEffect(() => {
        if (user?.isAdmin !== 1) {
            alert('Bạn không có quyền truy cập');
            navigate('/users');
            return;
        }

        const fetchUnits = async () => {
            try {

                const res = await api.get('/units/brands');
                if (res.success) {
                    setUnits(res.data);
                }
            } catch (e) { console.error(e); }
        };
        fetchUnits();
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users', formData);
            if (res.success) {
                alert('Tạo người dùng thành công!');
                navigate('/users');
            }
        } catch (error) {
            alert(error.message || 'Lỗi khi tạo người dùng.');
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Thêm người dùng mới</h2>
                <p>Khởi tạo tài khoản mới và cấp quyền truy cập vào hệ thống</p>
            </div>

            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-section-title">Thông tin cơ bản</div>
                        <div className="form-group-modern">
                            <label>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Nhập họ và tên đầy đủ..." />
                        </div>
                        <div className="form-group-modern">
                            <label>Tên đăng nhập <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="userName" required value={formData.userName} onChange={handleChange} placeholder="Tên để đăng nhập hệ thống..." />
                        </div>
                        <div className="form-group-modern">
                            <label>Địa chỉ Email <span style={{ color: 'red' }}>*</span></label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email liên hệ..." />
                        </div>
                        <div className="form-group-modern">
                            <label>MSSV / CCCD <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="identifyCard" required value={formData.identifyCard} onChange={handleChange} placeholder="Mã số sinh viên hoặc CCCD..." />
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
                        <div className="form-group-modern">
                            <label>Đơn vị quản lý <span style={{ color: 'red' }}>*</span></label>
                            <select name="unitId" required value={formData.unitId} onChange={handleChange}>
                                <option value="">-- Chọn đơn vị --</option>
                                {units.map(u => (
                                    <option key={u.id} value={u.unit?.id}>{u.unit?.title} ({u.brand?.title})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-modern">
                            <label>Vai trò hệ thống <span style={{ color: 'red' }}>*</span></label>
                            <select name="roleName" required value={formData.roleName} onChange={handleChange}>
                                <option value="Đoàn viên">Đoàn viên</option>
                                <option value="BCH Chi đoàn">BCH Chi đoàn</option>
                                <option value="BCH Khoa">BCH Khoa</option>
                                <option value="BCH Trường">BCH Trường</option>
                                <option value="Quản trị viên">Quản trị viên</option>
                            </select>
                        </div>

                        <div className="form-section-title">Bảo mật</div>
                        <div className="form-group-modern" style={{ gridColumn: '1 / -1' }}>
                            <label>Mật khẩu mặc định khởi tạo</label>
                            <input type="text" name="password" required value={formData.password} onChange={handleChange} />
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Hệ thống sẽ cấp mật khẩu này cho tài khoản mới. Người dùng có thể đổi lại sau khi đăng nhập.</p>
                        </div>
                    </div>

                    <div className="form-actions-modern">
                        <Link to="/users" className="btn-back-modern">Hủy bỏ</Link>
                        <button type="submit" className="btn-save">Tạo người dùng</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
