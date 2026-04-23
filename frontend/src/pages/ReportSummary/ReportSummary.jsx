import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import './ReportSummary.scss';
import api from '../../services/api';
import { useToast } from '../../components/Common/ToastNotification';

const ReportSummary = () => {
    const { user } = useAuthStore();
    const userRole = user?.roleName;
    const isAdmin = user?.isAdmin === 1;

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const { toast } = useToast();

    const allowedRoles = ['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn'];

    useEffect(() => {
        if (!isAdmin && !allowedRoles.includes(userRole)) return;
        fetchReport();
    }, [year]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports/summary', { params: { year } });
            if (res.success) {
                setSummary(res.data);
            }
        } catch (err) {
            toast.error(err.message || 'Không thể tải báo cáo tổng hợp.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin && !allowedRoles.includes(userRole)) {
        return <div className="container"><p className="error">Bạn không có quyền truy cập chức năng này.</p></div>;
    }

    if (loading) return <div className="container"><p style={{padding: '40px', textAlign: 'center'}}>Đang tải báo cáo...</p></div>;

    if (!summary) return <div className="container"><p>Không có dữ liệu.</p></div>;

    const collectionRate = summary.totalMembers ? Math.round((summary.paidMembers / summary.totalMembers) * 100) : 0;

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (collectionRate / 100) * circumference;

    return (
        <div className="container">
            <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px'}}>
                <div>
                    <h2>Báo cáo tổng hợp hoạt động</h2>
                    <p>Thống kê trực quan tình hình thu chi đoàn phí và tiến độ nộp của đoàn viên năm {year}.</p>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <label style={{fontWeight: '600', color: '#475569'}}>Năm:</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        style={{padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: '600'}}
                    >
                        {[2023, 2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
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
                        <div className="label-row"><span>Đã nộp:</span><span className="value">{summary.paidMembers} / {summary.totalMembers} HV</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: `${collectionRate}%`, background: '#8b5cf6'}}></div></div>
                    </div>
                    <div className="chart-bar">
                        <div className="label-row"><span>Chưa nộp:</span><span className="value" style={{color: '#ef4444'}}>{summary.unpaidMembers} HV</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: `${100 - collectionRate}%`, background: '#ef4444'}}></div></div>
                    </div>
                </div>
                
                {/* Thu chi tài chính */}
                <div className="report-card-modern">
                    <h3><i className="ri-wallet-3-line" style={{color: '#10b981'}}></i> Thu - Chi tài khoản</h3>
                    
                    <div style={{textAlign: 'center', margin: '15px 0'}}>
                        <p style={{color: '#64748b', margin: 0, fontSize: '0.9rem'}}>Thay đổi số dư</p>
                        <h2 style={{margin: '5px 0', color: '#10b981', fontSize: '2rem'}}>
                            {Number(summary.totalIncome) - Number(summary.totalExpense) >= 0 ? '+' : ''}
                            {new Intl.NumberFormat('vi-VN').format(Number(summary.totalIncome) - Number(summary.totalExpense))}{' '}
                            <span style={{fontSize:'1rem'}}>VND</span>
                        </h2>
                    </div>

                    <div className="chart-bar">
                        <div className="label-row"><span>Tổng thu:</span><span className="value">{new Intl.NumberFormat('vi-VN').format(summary.totalIncome)} đ</span></div>
                        <div className="progress-track"><div className="progress-fill" style={{width: '100%', background: '#10b981'}}></div></div>
                    </div>
                    
                    <div className="chart-bar">
                        <div className="label-row"><span>Tổng chi:</span><span className="value">{new Intl.NumberFormat('vi-VN').format(summary.totalExpense)} đ</span></div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{
                                width: `${summary.totalIncome > 0 ? (Number(summary.totalExpense) / Number(summary.totalIncome)) * 100 : 0}%`,
                                background: '#f59e0b'
                            }}></div>
                        </div>
                    </div>
                </div>

                {/* Hoạt động */}
                <div className="report-card-modern">
                    <h3><i className="ri-task-line" style={{color: '#0ea5e9'}}></i> Tình hình Xét duyệt</h3>
                    
                    <div style={{textAlign: 'center', margin: '15px 0'}}>
                        <p style={{color: '#64748b', margin: 0, fontSize: '0.9rem'}}>Tổng cộng</p>
                        <h2 style={{margin: '5px 0', color: '#0f172a', fontSize: '2rem'}}>
                            {summary.totalActivities} <span style={{fontSize:'1rem'}}>Hoạt động</span>
                        </h2>
                    </div>

                    <div className="chart-bar">
                        <div className="label-row"><span>Đã phê duyệt:</span><span className="value">{summary.approvedActivities}</span></div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{
                                width: `${summary.totalActivities > 0 ? (summary.approvedActivities / summary.totalActivities) * 100 : 0}%`,
                                background: '#0ea5e9'
                            }}></div>
                        </div>
                    </div>
                    <div className="chart-bar">
                        <div className="label-row"><span>Đang thực hiện / chờ duyệt:</span><span className="value">{summary.activeActivities}</span></div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{
                                width: `${summary.totalActivities > 0 ? (summary.activeActivities / summary.totalActivities) * 100 : 0}%`,
                                background: '#94a3b8'
                            }}></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportSummary;
