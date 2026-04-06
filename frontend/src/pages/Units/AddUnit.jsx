import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './UnitForm.scss';

const AddUnit = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    
    const searchParams = new URLSearchParams(location.search);
    const brand = searchParams.get('brand') || 'Đơn vị';

    return (
         <div className="container">
            <div style={{marginBottom: '15px'}}>
                <Link to="/units" className="btn-back">Quay về danh sách</Link>
            </div>
            <h2>Thêm {brand}</h2>
            <form onSubmit={(e) => { e.preventDefault(); navigate('/units'); }} className="form-add">
                <div className="form-group">
                    <label>Tên {brand}</label>
                    <input type="text" name="title" required className="form-control" />
                </div>
                <button type="submit" className="btn-add">Lưu</button>
            </form>
        </div>
    );
};

export default AddUnit;
