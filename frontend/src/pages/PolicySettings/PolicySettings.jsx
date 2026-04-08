import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import { policyService } from '../../services/policyService';
import { formatDate } from '../../utils/formatters';
import './PolicySettings.scss';
import { useToast } from '../../components/Common/ToastNotification';

const PolicySettings = () => {
    const { user } = useAuthStore();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await policyService.getAll();
            if (res.success) {
                setPolicies(res.data);
            }
        } catch (e) {
            console.error(e);
            toast.error("Lỗi khi tải chính sách đoàn phí");
        } finally {
            setLoading(false);
        }
    };

    if (user?.isAdmin !== 1) {
        return <div className="container"><p style={{color: 'red'}}>Bạn không có quyền truy cập trang này.</p></div>;
    }

    const handleAction = (e, action) => {
        e.preventDefault();
        toast.info(`Chức năng ${action} đang được phát triển.`);
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Quản lý Chính sách Đoàn phí</h2>
                <p>Cấu hình các quy định và mức thu chuẩn theo từng chu kỳ phân bổ</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <Link to="/policysettings/add" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', color: 'white' }}>
                    <i className="ri-add-line" style={{ marginRight: '8px' }}></i> Thiết lập Chính sách mới
                </Link>
            </div>
            
            <div className="data-table-card">
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Mã CS</th>
                                <th>Tên chính sách</th>
                                <th>Chu kỳ</th>
                                <th>Hạn nộp</th>
                                <th>Mức thu</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{textAlign: 'center', padding: '30px'}}>Đang tải dữ liệu...</td></tr>
                            ) : policies.length > 0 ? (
                                policies.map(p => (
                                    <tr key={p.id}>
                                        <td style={{fontWeight: '600', color: '#0ea5e9'}}>#{p.id}</td>
                                        <td style={{fontWeight: '600', color: '#0f172a'}}>{p.policyName}</td>
                                        <td>{p.cycle}</td>
                                        <td>{formatDate(p.dueDate)}</td>
                                        <td style={{fontWeight: '600', color: '#10b981'}}>{new Intl.NumberFormat('vi-VN').format(p.standardAmount)} đ</td>
                                        <td>
                                            {p.status === 'Active' ? (
                                                <span className="status-badge status-active">Kích hoạt</span>
                                            ) : (
                                                <span className="status-badge status-draft">Bản nháp</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="btn-actions">
                                                {p.status === 'Active' ? (
                                                    <button className="btn-deactivate" onClick={(e) => handleAction(e, 'Hủy kích hoạt')}>Hủy kích hoạt</button>
                                                ) : (
                                                    <>
                                                        <button className="btn-activate" onClick={(e) => handleAction(e, 'Kích hoạt')}>Kích hoạt</button>
                                                        <button className="btn-delete" onClick={(e) => handleAction(e, 'Xóa')}>Xóa</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" style={{textAlign: 'center', padding: '30px'}}>Không có dữ liệu thiết lập chính sách.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PolicySettings;
