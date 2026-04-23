import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './UnitForm.scss';
import { useToast } from '../../components/Common/ToastNotification';
import ConfirmModal from '../../components/Common/ConfirmModal';

const EditUnit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const res = await api.get(`/units/brands/${id}`);
                if (res.success && res.data) {
                    setTitle(res.data.unit?.title || '');
                }
            } catch (err) {
                toast.error(err.message || 'Lỗi tải dữ liệu đơn vị');
            }
        };
        fetchUnit();
    }, [id, toast]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmModal({ isOpen: true });
    };

    const handleConfirmSave = async () => {
        try {
            const res = await api.put(`/units/brands/${id}`, { title });
            if (res.success) {
                toast.success('Cập nhật đơn vị thành công!');
                navigate('/units');
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi cập nhật đơn vị');
        } finally {
            setConfirmModal({ isOpen: false });
        }
    };

    return (
         <div className="container">
            <div className="page-header">
                <h2>Chỉnh sửa Đơn vị</h2>
                <p>Cập nhật thông tin chi tiết cho đơn vị trực thuộc</p>
            </div>
            
            <div className="unit-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group-modern">
                            <label>Tên đơn vị</label>
                            <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Nhập tên đơn vị..." />
                        </div>
                    </div>
                    
                    <div className="form-actions-modern">
                        <Link to="/units" className="btn-back-modern">Quay lại</Link>
                        <button type="submit" className="btn-save">Lưu Thay Đổi</button>
                    </div>
                </form>
            </div>

            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                toggle={() => setConfirmModal({ isOpen: false })}
                title="Xác nhận cập nhật"
                message="Bạn có chắc chắn muốn lưu các thay đổi cho đơn vị này?"
                onConfirm={handleConfirmSave}
                confirmText="Đồng ý lưu"
                cancelText="Hủy bỏ"
                variant="info"
            />
        </div>
    );
};

export default EditUnit;
