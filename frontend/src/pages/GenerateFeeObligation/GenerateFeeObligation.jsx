import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import './GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const GenerateFeeObligation = () => {
    const { user } = useAuthStore();
    const isAdmin = user?.isAdmin === 1;
    const { toast } = useToast();

    if (!isAdmin) {
        return <div className="container"><p style={{color: 'red'}}>Bạn không có quyền truy cập chức năng này.</p></div>;
    }

    const handleGenerate = (e) => {
        e.preventDefault();
        toast.success("Đã sinh đợt cước phí mới cho toàn bộ người dùng!");
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
                        <label>Chọn chính sách đoàn phí:</label>
                        <select name="policy_id" required>
                            <option value="">-- Chọn chính sách --</option>
                            <option value="1">Đoàn phí Mẫu (Học kỳ - 24.000đ)</option>
                        </select>
                    </div>
                    
                    <div className="form-group-modern">
                        <label>Nhãn kỳ thu phí:</label>
                        <input type="text" name="cycle_label" placeholder="VD: HK1/2025" required />
                    </div>
                    
                    <div className="form-actions-modern">
                        <Link to="/" className="btn-back-modern">Hủy & Trở về</Link>
                        <button type="submit" className="btn-save">Chạy Tiến trình Sinh phí</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerateFeeObligation;
