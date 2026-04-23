import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Users.scss';
import { userService } from '../../services/userService';
import { formatDate, getGenderLabel } from '../../utils/formatters';
import Pagination from '../../components/Common/Pagination';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { useToast } from '../../components/Common/ToastNotification';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 10;

    const { toast } = useToast();
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, name: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await userService.getAll();
            if (res.success) {
                setUsers(res.data);
                setCurrentPage(1);
            }
        } catch (error) {
            toast.error(error.message || 'Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
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
            const res = await userService.delete(confirmModal.id);
            if (res.success) {
                toast.success('Đã xóa người dùng thành công.');
                fetchUsers();
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi xóa người dùng.');
        } finally {
            closeDeleteConfirm();
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = users.filter(user =>
        (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.userName && user.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.identifyCard && user.identifyCard.includes(searchQuery))
    );

    const currentUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="container">
            <div className="page-header">
                <h2>Quản lý người dùng</h2>
                <p>Danh sách tài khoản hệ thống</p>
            </div>

            <div className="table-card">
                <div className="table-toolbar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, ID, email..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="actions-bar">
                        <Link to="/users/import" className="btn-secondary-outline">
                            Import Excel
                        </Link>
                        <Link to="/users/add" className="btn-primary-gradient">
                            Thêm người dùng mới
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="modern-data-table">
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Thông tin tài khoản</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Đơn vị - Phân quyền</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center loading-cell" style={{ padding: '30px' }}>Đang tải dữ liệu...</td></tr>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map(row => (
                                    <tr key={row.userId} className="table-row">
                                        <td><span className="id-badge">{row.userId}</span></td>
                                        <td>
                                            <div className="user-info-cell">
                                                <div className="fw-bold text-dark">{row.fullName}</div>
                                                <div className="text-muted small">ID: {row.userName} | {row.email}</div>
                                                <div className="text-muted small">CCCD: {row.identifyCard || '---'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`gender-badge ${row.gender === 1 ? 'male' : row.gender === 0 ? 'female' : 'unknown'}`}>
                                                {getGenderLabel(row.gender)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <div className="fw-bold text-dark">{formatDate(row.birthDate) || '---'}</div>
                                                <div className="text-muted small">Đoàn viên: {formatDate(row.joinDate) || '---'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="unit-role-cell">
                                                <div className="unit-name text-primary-dark">
                                                    {row.unitBrand ? row.unitBrand.unit?.title : 'Chưa cập nhật khối/đơn vị'}
                                                </div>
                                                <span className={`role-badge ${row.isAdmin === 1 ? 'admin' : 'member'}`}>
                                                    {row.roleName || 'Đoàn viên'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="actions-cell text-center">
                                            <Link to={`/users/edit/${row.userId}`} className="action-btn edit-btn" title="Chỉnh sửa">
                                                Sửa
                                            </Link>
                                            {row.isAdmin !== 1 && (
                                                <button
                                                    className="action-btn delete-btn"
                                                    title="Xóa"
                                                    onClick={() => openDeleteConfirm(row.userId, row.fullName)}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center empty-cell" style={{ padding: '30px' }}>Không tìm thấy người dùng nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredUsers.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                />
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                toggle={closeDeleteConfirm}
                title="Xóa người dùng"
                message={`Bạn có chắc chắn muốn xóa người dùng: ${confirmModal.name}? Hành động này không thể hoàn tác.`}
                onConfirm={handleDelete}
                confirmText="Đồng ý xóa"
                cancelText="Hủy bỏ"
                variant="danger"
            />
        </div>
    );
};

export default Users;
