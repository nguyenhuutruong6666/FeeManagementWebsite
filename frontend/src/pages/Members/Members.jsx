import { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate, getGenderLabel } from '../../utils/formatters';
import './Members.scss';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');
    const [filterUnit, setFilterUnit] = useState('');

    useEffect(() => {
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
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
        try {
            // Adjust the endpoint to /users/:id to match our backend structure for deletion
            const res = await api.delete(`/users/${userId}`);
            if (res.success) {
                alert('Đã xóa người dùng thành công.');
                fetchMembers();
            }
        } catch (error) {
            alert(error.message || 'Lỗi khi xóa.');
        }
    };

    return (
        <div className="container">
            <h2>Danh sách đoàn viên</h2>
            
            <form className="filter-box" onSubmit={(e) => { e.preventDefault(); fetchMembers(); }}>
                <div className="filter-row" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div className="filter-item">
                        <label>Vai trò </label>
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="form-control">
                            <option value="">-- Tất cả --</option>
                            <option value="BCH Trường">BCH Trường</option>
                            <option value="BCH Khoa">BCH Khoa</option>
                            <option value="BCH Chi đoàn">BCH Chi đoàn</option>
                            <option value="Đoàn viên">Đoàn viên</option>
                        </select>
                    </div>
                    {/* Add Unit filter here if needed */}
                    <div className="filter-buttons" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary">Lọc</button>
                        <button type="button" className="btn" onClick={() => { setFilterRole(''); setFilterUnit(''); }}>⟲ Reset</button>
                    </div>
                </div>
            </form>

            <div className="table-wrapper">
                <table className="table styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>CCCD/MSV</th>
                            <th>Giới tính</th>
                            <th>Sinh</th>
                            <th>Ngày vào đoàn</th>
                            <th>Đơn vị</th>
                            <th>Vai trò</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="10" style={{textAlign: 'center'}}>Đang tải...</td></tr>
                        ) : members.length > 0 ? (
                            members.map(row => (
                                <tr key={row.userId}>
                                    <td>{row.userId}</td>
                                    <td>{row.fullName}</td>
                                    <td>{row.email}</td>
                                    <td>{row.identifyCard || '-'}</td>
                                    <td>{getGenderLabel(row.gender)}</td>
                                    <td>{formatDate(row.birthDate)}</td>
                                    <td>{formatDate(row.joinDate)}</td>
                                    <td>
                                        {row.unitBrand 
                                            ? `${row.unitBrand.unit?.title} (${row.unitBrand.brand?.title})` 
                                            : 'Chưa cập nhật'}
                                    </td>
                                    <td>{row.roleName}</td>
                                    <td>
                                        <button className="btn-delete" onClick={() => handleDelete(row.userId)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="10" style={{textAlign: 'center'}}>Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Members;
