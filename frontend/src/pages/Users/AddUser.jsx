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
                // To display units properly, we can use getBrands
                const res = await api.get('/units/brands');
                if (res.success) {
                    setUnits(res.data);
                }
            } catch(e) { console.error(e); }
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
            <h2>Thêm người dùng mới</h2>
            <form className="form-add" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên đăng nhập:</label>
                    <input type="text" name="userName" required value={formData.userName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>MSSV / CCCD:</label>
                    <input type="text" name="identifyCard" required value={formData.identifyCard} onChange={handleChange} />
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
                    <label>Ngày sinh:</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Ngày vào Đoàn:</label>
                    <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Đơn vị:</label>
                    <select name="unitId" required value={formData.unitId} onChange={handleChange}>
                        <option value="">-- Chọn đơn vị --</option>
                        {units.map(u => (
                            <option key={u.id} value={u.unit?.id}>{u.unit?.title} ({u.brand?.title})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Vai trò:</label>
                    <select name="roleName" required value={formData.roleName} onChange={handleChange}>
                        <option value="Đoàn viên">Đoàn viên</option>
                        <option value="BCH Chi đoàn">BCH Chi đoàn</option>
                        <option value="BCH Khoa">BCH Khoa</option>
                        <option value="BCH Trường">BCH Trường</option>
                        <option value="Quản trị viên">Quản trị viên</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Mật khẩu mặc định:</label>
                    <input type="text" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-save">Lưu</button>
                    <Link to="/users" className="btn-back">Quay lại</Link>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
