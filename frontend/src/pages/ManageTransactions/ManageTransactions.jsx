import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatters';
import './ManageTransactions.scss';
import { useToast } from '../../components/Common/ToastNotification';
import Pagination from '../../components/Common/Pagination';
import api from '../../services/api';

const ManageTransactions = () => {
    const { user } = useAuthStore();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const { toast } = useToast();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (search.trim()) params.search = search.trim();

            const res = await api.get('/fee-payments', { params });
            if (res.success) {
                setTransactions(res.data);
                setCurrentPage(1);
            }
        } catch (err) {
            toast.error(err.message || 'Không thể tải danh sách giao dịch.');
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = user?.isAdmin === 1;

    const handleUpdateStatus = async (e, paymentId, newStatus) => {
        e.preventDefault();
        try {
            // Nếu là xác nhận tiền mặt
            if (newStatus === 'Success') {
                const res = await api.post('/fee-payments/confirm-cash', { paymentId });
                if (res.success) {
                    toast.success(`Đã xác nhận giao dịch #${paymentId} thành công!`);
                    fetchTransactions();
                }
            } else {
                toast.info('Tính năng cập nhật trạng thái khác đang phát triển.');
            }
        } catch (err) {
            toast.error(err.message || 'Cập nhật thất bại.');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTransactions();
    };

    const currentTransactions = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getStatusLabel = (status) => {
        const map = {
            'Success': 'Thành công',
            'Pending': 'Chờ xử lý',
            'Failed': 'Thất bại',
            'VNPAY_Pending': 'Chờ VNPAY',
            'Canceled': 'Đã hủy',
        };
        return map[status] || status;
    };

    const getStatusClass = (status) => {
        const map = {
            'Success': 'status-success',
            'Pending': 'status-pending',
            'Failed': 'status-failed',
            'VNPAY_Pending': 'status-vnpay',
            'Canceled': 'status-canceled',
        };
        return map[status] || '';
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Quản lý Giao dịch</h2>
                <p>Theo dõi và duyệt các hóa đơn thanh toán trực tuyến toàn hệ thống</p>
            </div>
            
            <div className="data-table-card">
                <div className="search-toolbar">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nhập mã giao dịch hoặc tên người nộp..."
                        />
                        <select
                            className="status-filter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0'}}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Pending">Chờ xử lý</option>
                            <option value="Success">Thành công</option>
                            <option value="VNPAY_Pending">Chờ VNPAY</option>
                            <option value="Failed">Thất bại</option>
                            <option value="Canceled">Đã hủy</option>
                        </select>
                        <button type="submit" className="btn-search">Tìm kiếm</button>
                        {(search || filterStatus) && (
                            <button
                                type="button"
                                className="btn-reset"
                                onClick={() => { setSearch(''); setFilterStatus(''); setTimeout(fetchTransactions, 50); }}
                            >
                                Đặt lại
                            </button>
                        )}
                    </form>
                </div>

                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Mã GD</th>
                                <th>Người nộp</th>
                                <th>Đơn vị (Khối)</th>
                                <th>Kỳ phí</th>
                                <th>Số tiền</th>
                                <th>Hình thức</th>
                                <th>Ngày nộp</th>
                                <th>Trạng thái</th>
                                {isAdmin && <th>Thao tác</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={isAdmin ? "9" : "8"} style={{textAlign: 'center', padding: '30px'}}>Đang tải dữ liệu...</td></tr>
                            ) : currentTransactions.length > 0 ? currentTransactions.map(t => (
                                <tr key={t.id}>
                                    <td style={{fontWeight: '600', color: '#0ea5e9'}}>{t.transactionCode || `#${t.id}`}</td>
                                    <td>{t.payer?.fullName || '---'}</td>
                                    <td>
                                        {t.payer?.unitBrand
                                            ? `${t.payer.unitBrand.unit?.title} (${t.payer.unitBrand.brand?.title})`
                                            : '---'}
                                    </td>
                                    <td>{t.obligation?.policy?.policyName || t.obligation?.policy?.cycle || '---'}</td>
                                    <td style={{fontWeight: '600', color: '#10b981'}}>
                                        {new Intl.NumberFormat('vi-VN').format(t.amount)} đ
                                    </td>
                                    <td>{t.paymentMethod || '---'}</td>
                                    <td>{t.paymentDate ? formatDate(t.paymentDate) : '---'}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(t.status)}`}>
                                            {getStatusLabel(t.status)}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            {t.status === 'Pending' ? (
                                                <form className="inline-form" onSubmit={(e) => handleUpdateStatus(e, t.id, 'Success')}>
                                                    <button type="submit" className="btn-update">Xác nhận</button>
                                                </form>
                                            ) : (
                                                <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>—</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr><td colSpan={isAdmin ? "9" : "8"} style={{textAlign: 'center', padding: '30px'}}>Không có giao dịch nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && transactions.length > 0 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={transactions.length}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>
        </div>
    );
};

export default ManageTransactions;
