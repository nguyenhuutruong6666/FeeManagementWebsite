import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import './PolicySettings.scss';

const PolicySettings = () => {
    const { user } = useAuthStore();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await api.get('/fee-policy');
            if (res.success) {
                setPolicies(res.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (user?.isAdmin !== 1) {
        return <div className="container"><p style={{color: 'red'}}>Bạn không có quyền truy cập trang này.</p></div>;
    }

    return (
        <div className="container">
            <h2 style={{textAlign: 'center', color: '#2d3436', marginBottom: '20px'}}>Quản lý chính sách đoàn phí</h2>
            <div className="actions" style={{textAlign: 'right', marginBottom: '15px'}}>
                <Link to="/policy-settings/add" className="btn-add btn-policy-add">Thêm chính sách mới</Link>
            </div>
            
            <div className="table-wrapper">
                <table className="table policy-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên chính sách</th>
                            <th>Chu kỳ</th>
                            <th>Hạn nộp</th>
                            <th>Mức thu (VNĐ)</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{textAlign: 'center'}}>Đang tải...</td></tr>
                        ) : policies.length > 0 ? (
                            policies.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.policyName}</td>
                                    <td>{p.cycle}</td>
                                    <td>{formatDate(p.dueDate)}</td>
                                    <td>{new Intl.NumberFormat('vi-VN').format(p.standardAmount)}đ</td>
                                    <td>
                                        {p.status === 'Active' ? (
                                            <span className="status active">Kích hoạt</span>
                                        ) : (
                                            <span className="status draft">Nháp</span>
                                        )}
                                    </td>
                                    <td>
                                        {p.status === 'Active' ? (
                                            <button className="btn-deactivate">Hủy kích hoạt</button>
                                        ) : (
                                            <>
                                                <button className="btn-activate" style={{marginRight: '5px'}}>Kích hoạt</button>
                                                <button className="btn-delete">Xóa</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={{textAlign: 'center'}}>Không có chính sách nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PolicySettings;
