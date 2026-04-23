import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../components/Common/ToastNotification';

const ActivityApproval = () => {
    const { toast } = useToast();
    const [activities, setActivities] = useState([]);

    const fetchDrafts = async () => {
        try {
            const res = await api.get('/activities');
            if (res.success) {
                const drafts = res.data.filter(a => a.status === 'draft');
                setActivities(drafts);
            }
        } catch (err) {
            toast.error('Lỗi khi tải danh sách đề xuất');
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    const handleAction = async (id, type) => {
        try {
            const res = await api.put(`/activities/${id}/${type}`);
            if (res.success) {
                toast.success(type === 'approve' ? 'Đã duyệt đề xuất hoạt động!' : 'Đã từ chối đề xuất này!');
                fetchDrafts();
            }
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Phê duyệt Đề xuất Hoạt động</h2>
                <p>Xem xét kế hoạch hoạt động và dự trù kinh phí được đệ trình từ cơ sở.</p>
            </div>
            
            <div className="data-table-card">
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Đơn vị trình</th>
                                <th>Tên chương trình</th>
                                <th>Kinh phí</th>
                                <th>Trợ thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.length === 0 ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Không có đề xuất nào chờ duyệt.</td></tr>
                            ) : activities.map(a => (
                                <tr key={a.id}>
                                    <td style={{fontWeight: '600', color: '#0f172a'}}>{a.unitBrand?.unit?.title || 'Đơn vị ẩn danh'}</td>
                                    <td>{a.title}</td>
                                    <td style={{fontWeight: '600', color: '#0284c7'}}>{new Intl.NumberFormat('vi-VN').format(a.estimatedBudget)} đ</td>
                                    <td><span className="status-badge" style={{background: '#fef3c7', color: '#d97706'}}>Đang chờ duyệt</span></td>
                                    <td>
                                        <div className="btn-actions">
                                            <button className="btn-activate" onClick={() => handleAction(a.id, 'approve')}><i className="ri-check-line"></i> Duyệt</button>
                                            <button className="btn-delete" onClick={() => handleAction(a.id, 'reject')}><i className="ri-close-line"></i> Từ chối</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
                    <Link to="/activitymanagement" className="btn-modern-outline" style={{width: 'auto'}}><i className="ri-arrow-left-line"></i> Quay về</Link>
                </div>
            </div>
        </div>
    );
};

export default ActivityApproval;
