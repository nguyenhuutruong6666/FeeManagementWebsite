import { Link } from 'react-router-dom';
import './UserForm.scss';

const ImportUsers = () => {
    return (
        <div className="container">
            <div className="page-header">
                <h2>Nhập danh sách người dùng</h2>
                <p>Thêm nhanh người dùng hàng loạt bằng tệp dữ liệu mẫu</p>
            </div>

            <div className="form-wrapper">
                <form onSubmit={(e) => { e.preventDefault(); alert('Import mockup'); }}>
                    <div className="form-grid">
                        <div className="form-section-title">Nạp dữ liệu từ Excel</div>
                        <div className="form-group-modern" style={{ gridColumn: '1 / -1' }}>
                            <label>Chọn file dữ liệu (.xlsx) <span style={{ color: 'red' }}>*</span></label>
                            <input type="file" accept=".xlsx, .xls" required />
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px' }}>
                                Tải biểu mẫu chuẩn tại đây nếu bạn chưa có.
                            </p>
                        </div>
                    </div>

                    <div className="form-actions-modern">
                        <Link to="/users" className="btn-back-modern">Hủy bỏ</Link>
                        <button type="submit" className="btn-save">Xử lý Import</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImportUsers;
