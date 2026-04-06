import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
                        password: '' // empty unless changing
                    });
                }
            } catch(e) {
                alert('Lỗi tải dữ liệu người dùng');
                navigate('/users');
            }
        };
        fetchInitialInfo();
    }, [id, navigate]);

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
                // Check if user is an admin editing someone else, else navigate to profile
                if (user?.isAdmin === 1) navigate('/users');
                else navigate('/profile');
            }
        } catch(error) {
            alert(error.message || 'Cập nhật thất bại.');
        }
    };

    if (!formData) return <div className="container">Đang tải...</div>;

    return (
         <div className="container">
            <h2>Chỉnh sửa thông tin tài khoản</h2>
            <form className="form-edit" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên đăng nhập:</label>
                    <input type="text" value={formData.userName} disabled />
                </div>
                <div className="form-group">
                    <label>MSV/CCCD:</label>
                    <input type="text" name="identifyCard" value={formData.identifyCard} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Năm sinh:</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Giới tính:</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">-- Chưa rõ --</option>
                        <option value="1">Nam</option>
                        <option value="0">Nữ</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Ngày vào Đoàn:</label>
                    <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
                </div>
                
                {user?.isAdmin === 1 ? (
                    <div className="form-group">
                        <label>Đơn vị:</label>
                        <select name="unitId" required value={formData.unitId} onChange={handleChange}>
                            <option value="">-- Chọn đơn vị --</option>
                            {units.map(u => (
                                <option key={u.id} value={u.unit?.id}>{u.unit?.title} ({u.brand?.title})</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Đơn vị ID:</label>
                        <input type="text" value={formData.unitId} disabled />
                    </div>
                )}

                {user?.isAdmin === 1 ? (
                    <div className="form-group">
                        <label>Vai trò:</label>
                        <select name="roleName" value={formData.roleName} onChange={handleChange}>
                            <option value="Quản trị viên">Quản trị viên (Admin)</option>
                            <option value="BCH Trường">BCH Trường</option>
                            <option value="BCH Khoa">BCH Khoa</option>
                            <option value="BCH Chi đoàn">BCH Chi đoàn</option>
                            <option value="Đoàn viên">Đoàn viên</option>
                        </select>
                        {formData.roleName === 'Quản trị viên' && <p style={{fontSize: '0.8rem', color: 'orange'}}>(Khuyến nghị cấu hình isAdmin = 1 thay vì chỉ đổi Text)</p>}
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Vai trò:</label>
                        <input type="text" value={formData.roleName} disabled />
                    </div>
                )}
                
                <div className="form-group">
                    <label>Mật khẩu mới (Để trống nếu không đổi):</label>
                    <input type="password" name="password" placeholder="Nhập mật khẩu mới..." value={formData.password} onChange={handleChange} />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-save">Lưu thay đổi</button>
                    <Link to={id ? `/users` : `/profile`} className="btn-back">Quay lại</Link>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
