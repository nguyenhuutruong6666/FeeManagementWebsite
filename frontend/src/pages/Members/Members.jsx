import { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate, getGenderLabel } from '../../utils/formatters';
import './Members.scss';
import { useToast } from '../../components/Common/ToastNotification';
import ConfirmModal from '../../components/Common/ConfirmModal';
import Pagination from '../../components/Common/Pagination';
import useAuthStore from '../../store/authStore';

const Members = () => {
    const { user } = useAuthStore();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');
    const [filterUnit, setFilterUnit] = useState('');
    const [units, setUnits] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { toast } = useToast();
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, name: '' });

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await api.get('/units/brands');
                if (res.success) setUnits(res.data);
            } catch (err) {
                console.error('Lỗi tải danh sách đơn vị:', err);
            }
        };
        fetchUnits();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        fetchMembers();
    }, [filterRole, filterUnit]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterRole) params.filter_role = filterRole;
            if (filterUnit) params.filter_unit = filterUnit;

            const res = await api.get('/members', { params });
            if (res.success) {
                setMembers(res.data);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách đoàn viên:", error);
            toast.error("Không thể tải danh sách đoàn viên.");
        } finally {
            setLoading(false);
        }
    };

    const getRoleClass = (role) => {
        if (!role) return 'role-member';
        const r = role.toLowerCase();
        if (r.includes('admin')) return 'role-admin';
        if (r.includes('trường')) return 'role-bch-truong';
        if (r.includes('khoa')) return 'role-bch-khoa';
        if (r.includes('chi đoàn')) return 'role-bch-chidoan';
        if (r.includes('bch')) return 'role-bch';
        return 'role-member';
    };

    const openDeleteConfirm = (id, name) => {
        setConfirmModal({ isOpen: true, id, name });
    };

    const closeDeleteConfirm = () => {
        setConfirmModal({ isOpen: false, id: null, name: '' });
    };

    const handleDelete = async () => {
        if (!confirmModal.id) return;
        try {
            const res = await api.delete(`/users/${confirmModal.id}`);
            if (res.success) {
                toast.success('Đã xóa đoàn viên thành công.');
                fetchMembers();
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi xóa.');
        } finally {
            closeDeleteConfirm();
        }
    };

    const currentMembers = members.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getAvailableRoles = () => {
        if (user?.isAdmin === 1 || user?.roleName === 'BCH Trường') {
            return ['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn', 'Đoàn viên'];
        }
        if (user?.roleName === 'BCH Khoa') {
            return ['BCH Khoa', 'BCH Chi đoàn', 'Đoàn viên'];
        }
        if (user?.roleName === 'BCH Chi đoàn') {
            return ['BCH Chi đoàn', 'Đoàn viên'];
        }
        return ['Đoàn viên'];
    };

    const getAvailableUnits = () => {
        if (user?.isAdmin === 1 || user?.roleName === 'BCH Trường') {
            return units;
        }
        if (user?.roleName === 'BCH Khoa') {
            return units.filter(u => u.unit?.id === user?.unitId || u.parentUnitId === user?.unitId);
        }
        return units.filter(u => u.unit?.id === user?.unitId);
    };

    const availableRoles = getAvailableRoles();
    const availableUnits = getAvailableUnits();

    return (
        <div className="container">
            <div className="page-header">
                <h2>Danh sách Đoàn viên</h2>
                <p>Tra cứu và quản lý thông tin toàn bộ Đoàn viên trong Đơn vị trực thuộc của bạn</p>
            </div>
            
            <div className="data-table-card">
                <form className="filter-box search-toolbar" onSubmit={(e) => { e.preventDefault(); fetchMembers(); }}>
                    <div className="filter-item">
                        <label>Vai trò hệ thống</label>
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="form-control">
                            <option value="">-- Tất cả --</option>
                            {availableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Đơn vị trực thuộc</label>
                        <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className="form-control">
                            <option value="">-- Tất cả đơn vị --</option>
                            {availableUnits.map(u => (
                                <option key={u.id} value={u.unit?.id}>{u.unit?.title} ({u.brand?.title})</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-buttons">
                        <button type="submit" className="btn btn-primary">Áp dụng Lọc</button>
                        <button type="button" className="btn btn-reset" onClick={() => { setFilterRole(''); setFilterUnit(''); }}>Làm mới</button>
                    </div>
                </form>

                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>CCCD/MSV</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Ngày vào đoàn</th>
                                <th>Đơn vị (Khối)</th>
                                <th>Vai trò</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" style={{textAlign: 'center', padding: '30px'}}>Đang tải dữ liệu...</td></tr>
                            ) : currentMembers.length > 0 ? (
                                currentMembers.map(row => (
                                    <tr key={row.userId}>
                                        <td style={{fontWeight: '600', color: '#0f172a'}}>{row.fullName}</td>
                                        <td>{row.email}</td>
                                        <td>{row.identifyCard || '---'}</td>
                                        <td>{getGenderLabel(row.gender)}</td>
                                        <td>{formatDate(row.birthDate)}</td>
                                        <td>{formatDate(row.joinDate)}</td>
                                        <td>
                                            {row.unitBrand 
                                                ? `${row.unitBrand.unit?.title} (${row.unitBrand.brand?.title})` 
                                                : 'Chưa cập nhật'}
                                        </td>
                                        <td><span className={`role-badge ${getRoleClass(row.roleName)}`}>{row.roleName || 'Đoàn viên'}</span></td>
                                        <td>
                                            {row.isAdmin !== 1 && (
                                                <button className="btn-delete-modern" onClick={() => openDeleteConfirm(row.userId, row.fullName)}>Xóa</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="9" style={{textAlign: 'center', padding: '30px'}}>Không tìm thấy dữ liệu phù hợp</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {!loading && members.length > 0 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={members.length}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>

            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                toggle={closeDeleteConfirm}
                title="Xóa đoàn viên"
                message={`Bạn có chắc chắn muốn xóa đoàn viên: ${confirmModal.name}? Họ có thể mất quyền truy cập vào Đơn vị này.`}
                onConfirm={handleDelete}
                confirmText="Đồng ý xóa"
                cancelText="Hủy bỏ"
                variant="danger"
            />
        </div>
    );
};

export default Members;
