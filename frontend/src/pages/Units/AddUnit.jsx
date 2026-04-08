import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import './UnitForm.scss';
import { useToast } from '../../components/Common/ToastNotification';

const AddUnit = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    
    const searchParams = new URLSearchParams(location.search);
    const brandName = searchParams.get('brand') || 'Đơn vị';
    const parentId = searchParams.get('parent_ub_id') || null;
    const [title, setTitle] = useState('');
    
    const getBrandId = (name) => {
        if (name === 'Trường') return 1;
        if (name === 'Khoa') return 2;
        if (name === 'Chi đoàn') return 3;
        return 1;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/units/brands', {
                unitTitle: title,
                brandId: getBrandId(brandName),
                parentUnitId: parentId
            });
            if (res.success) {
                toast.success('Thêm tổ chức thành công!');
                navigate('/units');
            }
        } catch(err) {
            toast.error(err.message || 'Lỗi thêm tổ chức');
        }
    };

    return (
         <div className="container">
            <div className="page-header">
                <h2>Thêm {brandName} mới</h2>
                <p>Khởi tạo {brandName.toLowerCase()} trực thuộc hệ thống quản lý</p>
            </div>
            
            <div className="unit-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group-modern">
                            <label>Tên {brandName}</label>
                            <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder={`Nhập tên ${brandName.toLowerCase()}...`} />
                        </div>
                    </div>
                    
                    <div className="form-actions-modern">
                        <Link to="/units" className="btn-back-modern">Quay lại</Link>
                        <button type="submit" className="btn-save">Xác nhận Thêm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUnit;
