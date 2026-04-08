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
    const collectionRate = summary.total_members ? Math.round((summary.paid_members / summary.total_members) * 100) : 0;
    
    // Circle math
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (collectionRate / 100) * circumference;

    return (
        <div className="container">
            <div className="page-header">
                <h2>Báo cáo tổng hợp hoạt động</h2>
                <p>Thống kê trực quan tình hình thu chi đoàn phí và tiến độ nộp của đoàn viên năm {year}.</p>
            </div>
            
            <div className="report-grid">
                {/* Tỉ lệ thu đoàn phí */}
                <div className="report-card-modern">
                    <h3><i className="ri-pie-chart-2-line" style={{color: '#8b5cf6'}}></i> Tỷ lệ thu đoàn phí</h3>
                    
                    <div className="stat-circle">
                        <svg>
                            <circle className="bg" cx="75" cy="75" r={radius} />
                            <circle className="progress" cx="75" cy="75" r={radius} 
                                    style={{strokeDasharray: circumference, strokeDashoffset: dashoffset, stroke: '#8b5cf6'}} />
                        </svg>
                        <div className="percentage">{collectionRate}%</div>
                    </div>
                    
                    <div className="chart-bar">
                        <div className="label-row"><span>Đã nộp:</span><span className="value">{summary.paid_members} / {summary.total_members} HV</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: `${collectionRate}%`, background: '#8b5cf6'}}></div></div>
                    </div>
                    <div className="chart-bar">
                        <div className="label-row"><span>Chưa nộp:</span><span className="value" style={{color: '#ef4444'}}>{summary.unpaid_members} HV</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: `${100 - collectionRate}%`, background: '#ef4444'}}></div></div>
                    </div>
                </div>
                
                {/* Thu chi tài chính */}
                <div className="report-card-modern">
                    <h3><i className="ri-wallet-3-line" style={{color: '#10b981'}}></i> Thu - Chi tài khoản</h3>
                    
                    <div style={{textAlign: 'center', margin: '15px 0'}}>
                        <p style={{color: '#64748b', margin: 0, fontSize: '0.9rem'}}>Thay đổi số dư</p>
                        <h2 style={{margin: '5px 0', color: '#10b981', fontSize: '2rem'}}>+{new Intl.NumberFormat('vi-VN').format(summary.total_income - summary.total_expense)} <span style={{fontSize:'1rem'}}>VND</span></h2>
                    </div>

                    <div className="chart-bar">
                        <div className="label-row"><span>Tổng thu:</span><span className="value">{new Intl.NumberFormat('vi-VN').format(summary.total_income)} đ</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: '100%', background: '#10b981'}}></div></div>
                    </div>
                    
                    <div className="chart-bar">
                        <div className="label-row"><span>Tổng chi:</span><span className="value">{new Intl.NumberFormat('vi-VN').format(summary.total_expense)} đ</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: `${(summary.total_expense / (summary.total_income || 1)) * 100}%`, background: '#f59e0b'}}></div></div>
                    </div>
                </div>

                {/* Hoạt động */}
                <div className="report-card-modern">
                    <h3><i className="ri-task-line" style={{color: '#0ea5e9'}}></i> Tình hình Xét duyệt</h3>
                    
                    <div style={{textAlign: 'center', margin: '15px 0'}}>
                        <p style={{color: '#64748b', margin: 0, fontSize: '0.9rem'}}>Tổng cộng</p>
                        <h2 style={{margin: '5px 0', color: '#0f172a', fontSize: '2rem'}}>{summary.total_activities} <span style={{fontSize:'1rem'}}>Hoạt động</span></h2>
                    </div>

                    <div className="chart-bar">
                        <div className="label-row"><span>Đã phê duyệt:</span><span className="value">{summary.approved_activities}</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: `${(summary.approved_activities / summary.total_activities) * 100}%`, background: '#0ea5e9'}}></div></div>
                    </div>
                    <div className="chart-bar">
                        <div className="label-row"><span>Đang thực hiện chờ duyệt:</span><span className="value">{summary.active_activities}</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: `${(summary.active_activities / summary.total_activities) * 100}%`, background: '#94a3b8'}}></div></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportSummary;
