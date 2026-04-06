import { Link } from 'react-router-dom';

const ImportUsers = () => {
    return (
         <div className="container">
            <h2>Nhập danh sách người dùng</h2>
            <div style={{background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '500px'}}>
                <form onSubmit={(e) => { e.preventDefault(); alert('Import mockup'); }}>
                    <div className="form-group">
                        <label>Chọn file Excel (.xlsx):</label>
                        <input type="file" accept=".xlsx, .xls" required className="form-control" />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-save">Import</button>
                        <Link to="/users" className="btn-back" style={{padding: '8px 12px', background: '#6c757d', color: 'white', borderRadius: '6px', textDecoration: 'none', marginLeft: '10px'}}>Quay lại</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImportUsers;
