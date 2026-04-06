import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import './GenerateFeeObligation.scss';

const GenerateFeeObligation = () => {
    const { user } = useAuthStore();
    const isAdmin = user?.isAdmin === 1;

    if (!isAdmin) {
        return <div className="container"><p style={{color: 'red'}}>Bạn không có quyền truy cập chức năng này.</p></div>;
    }

    return (
        <div className="container">
            <h2>Sinh nghĩa vụ đoàn phí theo kỳ</h2>
            
            <form className="form-generate" onSubmit={(e) => { e.preventDefault(); alert('Sinh nghĩa vụ mock!'); }}>
                <div className="form-group">
                    <label>Chọn chính sách đoàn phí:</label>
                    <select name="policy_id" required className="form-control">
                        <option value="">-- Chọn chính sách --</option>
                        <option value="1">Đoàn phí Mẫu (Học kỳ - 24.000đ)</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Nhập nhãn chu kỳ:</label>
                    <input type="text" name="cycle_label" placeholder="VD: HK1/2025" required className="form-control" />
                </div>
                
                <div className="form-actions" style={{marginTop: '20px'}}>
                    <button type="submit" className="btn-generate" style={{background: '#0984e3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', marginRight: '10px'}}>Sinh nghĩa vụ</button>
                    <Link to="/" className="btn-back" style={{background: '#6c757d', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px'}}>Quay lại</Link>
                </div>
            </form>
        </div>
    );
};

export default GenerateFeeObligation;
