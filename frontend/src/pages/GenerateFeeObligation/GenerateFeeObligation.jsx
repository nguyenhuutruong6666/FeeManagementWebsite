import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import './GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';
import api from '../../services/api';

const GenerateFeeObligation = () => {
    const { user } = useAuthStore();
    const isAdmin = user?.isAdmin === 1;
    const { toast } = useToast();

    const [policies, setPolicies] = useState([]);
    const [policyId, setPolicyId] = useState('');
    const [periodLabel, setPeriodLabel] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingPolicies, setLoadingPolicies] = useState(true);
    const [lastResult, setLastResult] = useState(null);

    useEffect(() => {
        if (!isAdmin) return;
        const fetchPolicies = async () => {
            try {
                const res = await api.get('/fee-policies');
                if (res.success) {
                    // Chỉ hiện các chính sách Active hoặc Draft
                    setPolicies(res.data);
                }
            } catch (e) {
                toast.error('Không thể tải danh sách chính sách.');
            } finally {
                setLoadingPolicies(false);
            }
        };
        fetchPolicies();
    }, [isAdmin]);

    if (!isAdmin) {
        return <div className="container"><p style={{color: 'red'}}>Bạn không có quyền truy cập chức năng này.</p></div>;
    }

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!policyId || !periodLabel.trim()) {
            toast.warning('Vui lòng chọn chính sách và nhập nhãn kỳ thu phí.');
            return;
        }
        setLoading(true);
        setLastResult(null);
        try {
            const res = await api.post('/fee-obligations/generate', {
                policyId: parseInt(policyId),
                periodLabel: periodLabel.trim(),
            });
            if (res.success) {
                const { success, failed } = res.data;
                setLastResult({ success, failed });
                if (failed === 0) {
                    toast.success(`Sinh phí thành công! ${success} nghĩa vụ đã được tạo.`);
                } else {
                    toast.warning(`Hoàn thành: ${success} thành công, ${failed} thất bại.`);
                }
            }
        } catch (err) {
            toast.error(err.message || 'Sinh nghĩa vụ phí thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Sinh Danh sách Phí theo chu kỳ</h2>
                <p>Khởi tạo đợt thu phí mới đồng loạt cho các thành viên dựa trên thiết lập chính sách đã có</p>
            </div>
            
            <div className="policy-form-wrapper">
                <form onSubmit={handleGenerate}>
                    <div className="form-group-modern">
                        <label>Chọn chính sách đoàn phí: <span style={{color: 'red'}}>*</span></label>
                        {loadingPolicies ? (
                            <select disabled><option>Đang tải...</option></select>
                        ) : (
                            <select
                                name="policy_id"
                                required
                                value={policyId}
                                onChange={(e) => setPolicyId(e.target.value)}
                            >
                                <option value="">-- Chọn chính sách --</option>
                                {policies.map(p => (
                                    <option key={p.id} value={p.id}>
                                        [{p.status}] {p.policyName} — {p.cycle} — {new Intl.NumberFormat('vi-VN').format(p.standardAmount)}đ
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Nhãn kỳ thu phí: <span style={{color: 'red'}}>*</span></label>
                        <input
                            type="text"
                            name="cycle_label"
                            placeholder="VD: HK1/2025"
                            required
                            value={periodLabel}
                            onChange={(e) => setPeriodLabel(e.target.value)}
                        />
                        <small style={{color: '#64748b', fontSize: '0.82rem'}}>
                            Nhãn này dùng để phân biệt các kỳ thu, ví dụ: HK1/2025, Năm/2024...
                        </small>
                    </div>

                    {lastResult && (
                        <div style={{
                            padding: '16px 20px',
                            borderRadius: '10px',
                            background: lastResult.failed === 0 ? '#f0fdf4' : '#fffbeb',
                            border: `1px solid ${lastResult.failed === 0 ? '#86efac' : '#fcd34d'}`,
                            marginBottom: '20px'
                        }}>
                            <p style={{margin: 0, fontWeight: '600', color: lastResult.failed === 0 ? '#15803d' : '#b45309'}}>
                                Kết quả: {lastResult.success} thành công / {lastResult.failed} thất bại
                            </p>
                            {lastResult.failed > 0 && (
                                <p style={{margin: '4px 0 0', fontSize: '0.85rem', color: '#92400e'}}>
                                    Lỗi có thể do đoàn viên đã tồn tại nghĩa vụ với mã tham chiếu trùng.
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div className="form-actions-modern">
                        <Link to="/" className="btn-back-modern">Hủy &amp; Trở về</Link>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Chạy Tiến trình Sinh phí'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerateFeeObligation;
