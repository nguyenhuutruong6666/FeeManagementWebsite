import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import { useToast } from '../../components/Common/ToastNotification';
import ConfirmModal from '../../components/Common/ConfirmModal';
import './UserForm.scss';

const EditUser = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams();
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState(null);
    const { toast } = useToast();
    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

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
                toast.error('Lỗi tải dữ liệu người dùng. Vui lòng thử lại sau.');
                if (user?.isAdmin === 1) navigate('/users');
                else navigate('/profile');
            }
        };
        if (id) {
            fetchInitialInfo();
        }
    }, [id, navigate, user, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const handleSubmit = async () => {
        setIsConfirmOpen(false);
        setLoadingSubmit(true);
        try {
            const payload = { ...formData };
            if (payload.roleName === 'Quản trị viên') {
                payload.isAdmin = 1;
            } else {
                payload.isAdmin = 0;
            }
            
            const res = await api.put(`/users/${id}`, payload);
            if (res.success) {
                toast.success('Cập nhật thông tin thành công!');
                setTimeout(() => {
                    if (user?.isAdmin === 1 && user?.userId !== Number(id)) navigate('/users');
                    else navigate('/profile');
                }, 1500);
            }
        } catch (error) {
            toast.error(error.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (!formData) return <div className="container">Đang tải...</div>;

    const isSelfEdit = user?.userId === Number(id);

    return (
        <div className="container">
            <div className="page-header">
                <h2>{isSelfEdit ? 'Chỉnh sửa thông tin cá nhân' : 'Cập nhật thông tin Người dùng'}</h2>
                <p>Cập nhật chính xác dữ liệu của bạn trong hệ thống</p>
            </div>

            <div className="form-wrapper">
                <form onSubmit={handlePreSubmit}>
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
                        <button type="submit" className="btn-save" disabled={loadingSubmit}>
                            {loadingSubmit ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                toggle={() => setIsConfirmOpen(false)}
                title={isSelfEdit ? "Xác nhận cập nhật thông tin" : "Xác nhận chỉnh sửa người dùng"}
                message="Bạn có chắc chắn muốn lưu lại các thay đổi này không? Thông tin mới sẽ ghi đè lên dữ liệu cũ trên hệ thống."
                onConfirm={handleSubmit}
                confirmText="Đồng ý lưu"
                cancelText="Hủy bỏ"
                variant="info"
            />
        </div>
    );
};

export default EditUser;
