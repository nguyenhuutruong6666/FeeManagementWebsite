import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import './UnitForm.scss';

const AddUnit = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    
    const searchParams = new URLSearchParams(location.search);
    const brandName = searchParams.get('brand') || 'Đơn vị';
    const parentId = searchParams.get('parent_ub_id') || null;
    const [title, setTitle] = useState('');
    
    // Reverse map brand names string to ID since our DB expects brandId
    // Brand 1 = Trường, 2 = Khoa, 3 = Chi đoàn
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
                alert('Thêm tổ chức thành công!');
                navigate('/units');
            }
        } catch(err) {
            alert(err.message || 'Lỗi thêm tổ chức');
        }
    };

    return (
         <div className="container">
            <div style={{marginBottom: '15px'}}>
                <Link to="/units" className="btn-back">Quay về danh sách</Link>
            </div>
            <h2>Thêm {brandName}</h2>
            <form onSubmit={handleSubmit} className="form-add">
                <div className="form-group">
                    <label>Tên {brandName}</label>
                    <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required className="form-control" />
                </div>
                <button type="submit" className="btn-add">Lưu</button>
            </form>
        </div>
    );
};

export default AddUnit;
