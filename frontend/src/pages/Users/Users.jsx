import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Users.scss';
import { userService } from '../../services/userService';
import { formatDate, getGenderLabel } from '../../utils/formatters';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await userService.getAll();
            if (res.success) {
                setUsers(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Quản lý người dùng</h2>

            <div className="actions-bar">
                <Link to="/users/add" className="btn-add">Thêm người dùng</Link>
                <Link to="/users/import" className="btn-success">Import danh sách</Link>
            </div>

            <div className="table-wrapper">
                <table className="table styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên đăng nhập</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>MSV/CCCD</th>
                            <th>Giới tính</th>
                            <th>Năm sinh</th>
                            <th>Ngày vào Đoàn</th>
                            <th>Đơn vị</th>
                            <th>Vai trò</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="11" style={{textAlign: 'center'}}>Đang tải...</td></tr>
                        ) : users.length > 0 ? (
                            users.map(row => (
                                <tr key={row.userId}>
                                    <td>{row.userId}</td>
                                    <td>{row.userName}</td>
                                    <td>{row.fullName}</td>
                                    <td>{row.email}</td>
                                    <td>{row.identifyCard || '-'}</td>
                                    <td>{getGenderLabel(row.gender)}</td>
                                    <td>{formatDate(row.birthDate)}</td>
                                    <td>{formatDate(row.joinDate)}</td>
                                    <td>
                                        {row.unitBrand 
                                            ? row.unitBrand.unit?.title
                                            : 'Chưa cập nhật'}
                                    </td>
                                    <td>{row.roleName || 'Chưa gán'}</td>
                                    <td className="actions-cell">
                                        <Link to={`/users/edit/${row.userId}`} className="btn-edit" title="Sửa">Sửa</Link>
                                        {row.isAdmin !== 1 && (
                                            <a href="#" className="btn-delete" title="Xóa" onClick={(e) => { e.preventDefault(); alert('Đã hủy tài khoản mock'); }}>Xóa</a>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="11" style={{textAlign: 'center'}}>Không có người dùng nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
