import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { formatDate } from '../../utils/formatters';
import './ManageTransactions.scss';

const ManageTransactions = () => {
    const { user } = useAuthStore();
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Mock data representing the UI
        setTransactions([
            { id: 1, transaction_code: 'TXN-ABC123XYZ', payer_name: 'Nguyễn Văn A', unit_title: 'K72E1', brand_title: 'Chi đoàn', period_label: 'Học kỳ', amount: 24000, payment_method: 'Cash', payment_date: '2024-05-15T10:30:00Z', status: 'Success' },
            { id: 2, transaction_code: 'TXN-XYZ987', payer_name: 'Trần Thị B', unit_title: 'K72E1', brand_title: 'Chi đoàn', period_label: 'Học kỳ', amount: 24000, payment_method: 'VNPAY', payment_date: '2024-05-14T09:15:00Z', status: 'Pending' }
        ]);
    }, []);

    const isAdmin = user?.isAdmin === 1;

    return (
        <div className="container">
            <h2>Quản lý giao dịch đoàn phí</h2>
            
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); }}>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." />
                <button type="submit" className="btn-search">Tìm kiếm</button>
                {search && <button type="button" className="btn-reset" onClick={() => setSearch('')}>Đặt lại</button>}
            </form>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã GD</th>
                            <th>Người nộp</th>
                            <th>Đơn vị</th>
                            <th>Kỳ phí</th>
                            <th>Số tiền</th>
                            <th>Hình thức</th>
                            <th>Ngày</th>
                            <th>Trạng thái</th>
                            {isAdmin && <th>Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.transaction_code}</td>
                                <td>{t.payer_name}</td>
                                <td>{t.unit_title} ({t.brand_title})</td>
                                <td>{t.period_label}</td>
                                <td>{new Intl.NumberFormat('vi-VN').format(t.amount)}đ</td>
                                <td>{t.payment_method}</td>
                                <td>{formatDate(t.payment_date)}</td>
                                <td>
                                    <span className={`status ${t.status.toLowerCase().replace(' ', '')}`}>{t.status}</span>
                                </td>
                                {isAdmin && (
                                    <td>
                                        <form className="inline-form" onSubmit={(e) => e.preventDefault()}>
                                            <select defaultValue={t.status} className="status-select">
                                                <option value="Pending">Pending</option>
                                                <option value="Success">Success</option>
                                                <option value="Failed">Failed</option>
                                                <option value="Need review">Need review</option>
                                                <option value="Canceled">Canceled</option>
                                            </select>
                                            <button type="button" className="btn-update">Lưu</button>
                                        </form>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageTransactions;
