import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import { policyService } from '../../services/policyService';
import { formatDate } from '../../utils/formatters';
import './PolicySettings.scss';
import { useToast } from '../../components/Common/ToastNotification';
import ConfirmModal from '../../components/Common/ConfirmModal';
import api from '../../services/api';

const PolicySettings = () => {
    const { user } = useAuthStore();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, action: '', policyName: '' });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const res = await policyService.getAll();
            if (res.success) {
                setPolicies(res.data);
            }
        } catch (e) {
            console.error(e);
            toast.error('Lỗi khi tải chính sách đoàn phí');
        } finally {
            setLoading(false);
        }
    };

    if (user?.isAdmin !== 1) {
        return <div className="container"><p style={{color: 'red'}}>Bạn không có quyền truy cập trang này.</p></div>;
    }

    const openConfirm = (id, action, policyName) => {
        setConfirmModal({ isOpen: true, id, action, policyName });
    };

    const closeConfirm = () => {
        setConfirmModal({ isOpen: false, id: null, action: '', policyName: '' });
    };

    const handleConfirmAction = async () => {
        const { id, action } = confirmModal;
        setActionLoading(true);
        try {
            let res;
            if (action === 'activate') {
                res = await api.put(`/fee-policies/${id}/activate`);
                if (res.success) toast.success('Đã kích hoạt chính sách thành công!');
            } else if (action === 'deactivate') {
                res = await api.put(`/fee-policies/${id}/deactivate`);
                if (res.success) toast.success('Đã hủy kích hoạt chính sách!');
            } else if (action === 'delete') {
                res = await api.delete(`/fee-policies/${id}`);
                if (res.success) toast.success('Đã xóa chính sách thành công!');
            }
            fetchPolicies();
        } catch (err) {
            toast.error(err.message || 'Thao tác thất bại. Vui lòng thử lại.');
        } finally {
            setActionLoading(false);
            closeConfirm();
        }
    };

    const getConfirmText = () => {
        const { action, policyName } = confirmModal;
        if (action === 'activate') return `Bạn có chắc muốn kích hoạt chính sách "${policyName}"?`;
        if (action === 'deactivate') return `Bạn có chắc muốn hủy kích hoạt chính sách "${policyName}"?`;
        if (action === 'delete') return `Bạn có chắc muốn XÓA chính sách "${policyName}"? Hành động này không thể hoàn tác.`;
        return '';
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
                                                    <button
                                                        className="btn-deactivate"
                                                        onClick={() => openConfirm(p.id, 'deactivate', p.policyName)}
                                                        disabled={actionLoading}
                                                    >
                                                        Hủy kích hoạt
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn-activate"
                                                            onClick={() => openConfirm(p.id, 'activate', p.policyName)}
                                                            disabled={actionLoading}
                                                        >
                                                            Kích hoạt
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => openConfirm(p.id, 'delete', p.policyName)}
                                                            disabled={actionLoading}
                                                        >
                                                            Xóa
                                                        </button>
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

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                toggle={closeConfirm}
                title={
                    confirmModal.action === 'delete' ? 'Xóa chính sách' :
                    confirmModal.action === 'activate' ? 'Kích hoạt chính sách' :
                    'Hủy kích hoạt chính sách'
                }
                message={getConfirmText()}
                onConfirm={handleConfirmAction}
                confirmText={
                    confirmModal.action === 'delete' ? 'Xóa' :
                    confirmModal.action === 'activate' ? 'Kích hoạt' :
                    'Hủy kích hoạt'
                }
                cancelText="Hủy bỏ"
                variant={confirmModal.action === 'delete' ? 'danger' : 'warning'}
            />
        </div>
    );
};

export default PolicySettings;
