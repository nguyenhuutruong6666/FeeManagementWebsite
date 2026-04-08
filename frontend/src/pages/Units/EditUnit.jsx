import { Link, useNavigate, useParams } from 'react-router-dom';
import './UnitForm.scss';
import { useToast } from '../../components/Common/ToastNotification';

const EditUnit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();

    return (
         <div className="container">
            <div className="page-header">
                <h2>Chỉnh sửa Đơn vị</h2>
                <p>Cập nhật thông tin chi tiết cho đơn vị trực thuộc</p>
            </div>
            
            <div className="unit-form-wrapper">
                <form onSubmit={(e) => { e.preventDefault(); toast.info('Chức năng cập nhật đang được phát triển.'); navigate('/units'); }}>
                    <div className="form-grid">
                        <div className="form-group-modern">
                            <label>Tên đơn vị</label>
                            <input type="text" name="title" defaultValue={`Đơn vị ${id}`} required placeholder="Nhập tên đơn vị..." />
                        </div>
                    </div>
                    
                    <div className="form-actions-modern">
                        <Link to="/units" className="btn-back-modern">Quay lại</Link>
                        <button type="submit" className="btn-save">Lưu Thay Đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUnit;
