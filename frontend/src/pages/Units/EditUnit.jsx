import { Link, useNavigate, useParams } from 'react-router-dom';
import './UnitForm.scss';

const EditUnit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
         <div className="container">
            <div style={{marginBottom: '15px'}}>
                <Link to="/units" className="btn-back">Quay về danh sách</Link>
            </div>
            <h2>Chỉnh sửa Đơn vị</h2>
            <form onSubmit={(e) => { e.preventDefault(); navigate('/units'); }} className="form-add">
                <div className="form-group">
                    <label>Tên đơn vị</label>
                    <input type="text" name="title" defaultValue={`Đơn vị ${id}`} required className="form-control" />
                </div>
                <button type="submit" className="btn-add">Lưu</button>
            </form>
        </div>
    );
};

export default EditUnit;
