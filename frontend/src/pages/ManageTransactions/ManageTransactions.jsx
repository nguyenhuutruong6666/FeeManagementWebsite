import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatters';
import './ManageTransactions.scss';
import { useToast } from '../../components/Common/ToastNotification';
import Pagination from '../../components/Common/Pagination';

const ManageTransactions = () => {
    const { user } = useAuthStore();
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    const { toast } = useToast();

    useEffect(() => {

        setTransactions([
            { id: 1, transaction_code: 'TXN-ABC123XYZ', payer_name: 'Nguyễn Văn A', unit_title: 'K72E1', brand_title: 'Chi đoàn', period_label: 'Học kỳ', amount: 24000, payment_method: 'Tiền mặt', payment_date: '2024-05-15T10:30:00Z', status: 'Success' },
            { id: 2, transaction_code: 'TXN-XYZ987', payer_name: 'Trần Thị B', unit_title: 'K72E1', brand_title: 'Chi đoàn', period_label: 'Học kỳ', amount: 24000, payment_method: 'VNPAY', payment_date: '2024-05-14T09:15:00Z', status: 'Pending' }
        ]);
    }, []);

    const isAdmin = user?.isAdmin === 1;

    const handleUpdateStatus = (e, txnId) => {
        e.preventDefault();
        toast.success(`Cập nhật trạng thái giao dịch ${txnId} thành công!`);
    };

    const currentTransactions = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="container">
            <div className="page-header">
                <h2>Quản lý Giao dịch</h2>
                <p>Theo dõi và duyệt các hóa đơn thanh toán trực tuyến toàn hệ thống</p>
            </div>
            
            <div className="data-table-card">
                <div className="search-toolbar">
                    <form className="search-form" onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }}>
                        <input type="text" className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nhập mã giao dịch hoặc tên người nộp..." />
                        <button type="submit" className="btn-search">Tìm kiếm</button>
                        {search && <button type="button" className="btn-reset" onClick={() => { setSearch(''); setCurrentPage(1); }}>Đặt lại</button>}
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
                            {currentTransactions.length > 0 ? currentTransactions.map(t => (
                                <tr key={t.id}>
                                    <td style={{fontWeight: '600', color: '#0ea5e9'}}>{t.transaction_code}</td>
                                    <td>{t.payer_name}</td>
                                    <td>{t.unit_title} ({t.brand_title})</td>
                                    <td>{t.period_label}</td>
                                    <td style={{fontWeight: '600', color: '#10b981'}}>{new Intl.NumberFormat('vi-VN').format(t.amount)} đ</td>
                                    <td>{t.payment_method}</td>
                                    <td>{formatDate(t.payment_date)}</td>
                                    <td>
                                        <span className={`status-badge status-${t.status.toLowerCase().replace(' ', '')}`}>
                                            {t.status === 'Success' ? 'Thành công' : t.status === 'Pending' ? 'Chờ xử lý' : t.status}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <form className="inline-form" onSubmit={(e) => handleUpdateStatus(e, t.transaction_code)}>
                                                <select defaultValue={t.status} className="status-select">
                                                    <option value="Pending">Chờ xử lý</option>
                                                    <option value="Success">Thành công</option>
                                                    <option value="Failed">Thất bại</option>
                                                    <option value="Need review">Cần xem xét</option>
                                                    <option value="Canceled">Hủy bỏ</option>
                                                </select>
                                                <button type="submit" className="btn-update">Lưu thay đổi</button>
                                            </form>
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr><td colSpan={isAdmin ? "9" : "8"} style={{textAlign: 'center', padding: '30px'}}>Không có giao dịch nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.length > 0 && (
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
