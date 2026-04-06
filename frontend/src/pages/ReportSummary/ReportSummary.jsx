import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import './ReportSummary.scss';

const ReportSummary = () => {
    const { user } = useAuthStore();
    const userRole = user?.roleName;
    const isAdmin = user?.isAdmin === 1;

    const [summary, setSummary] = useState(null);

    useEffect(() => {
        // Mock data representing the UI
        setSummary({
            total_members: 150,
            paid_members: 120,
            unpaid_members: 30,
            total_activities: 15,
            approved_activities: 10,
            active_activities: 5,
            total_income: 15000000,
            total_expense: 5000000
        });
    }, []);

    const allowedRoles = ['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'];
    if (!isAdmin && !allowedRoles.includes(userRole)) {
        return <div className="container"><p className="error">Bạn không có quyền truy cập chức năng này.</p></div>;
    }

    if (!summary) return <div className="container">Đang tải...</div>;

    const year = new Date().getFullYear();

    return (
        <div className="container">
            <h2>Báo cáo tổng hợp hoạt động đoàn phí</h2>
            
            <div className="report-card">
                <h3>Thống kê đoàn viên</h3>
                <p><b>Tổng đoàn viên:</b> {summary.total_members}</p>
                <p style={{color: 'green'}}><b>Đã nộp đoàn phí:</b> {summary.paid_members}</p>
                <p style={{color: 'red'}}><b>Chưa nộp:</b> {summary.unpaid_members}</p>
                <p><b>Tỷ lệ thu:</b> {summary.total_members ? Math.round((summary.paid_members / summary.total_members) * 100) : 0}%</p>
            </div>
            
            <div className="report-card">
                <h3>Thống kê hoạt động</h3>
                <p><b>Tổng số hoạt động:</b> {summary.total_activities}</p>
                <p style={{color: '#0984e3'}}><b>Đã phê duyệt:</b> {summary.approved_activities}</p>
                <p style={{color: '#f39c12'}}><b>Đang thực hiện:</b> {summary.active_activities}</p>
            </div>
            
            <div className="report-card">
                <h3>Thu - chi năm {year}</h3>
                <p style={{color: '#27ae60'}}><b>Tổng thu:</b> {new Intl.NumberFormat('vi-VN').format(summary.total_income)}đ</p>
                <p style={{color: '#e74c3c'}}><b>Tổng chi:</b> {new Intl.NumberFormat('vi-VN').format(summary.total_expense)}đ</p>
                <p><b>Số dư năm:</b> {new Intl.NumberFormat('vi-VN').format(summary.total_income - summary.total_expense)}đ</p>
            </div>
        </div>
    );
};

export default ReportSummary;
