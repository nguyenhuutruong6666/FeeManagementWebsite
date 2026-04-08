import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../GenerateFeeObligation/GenerateFeeObligation.scss';
import { useToast } from '../../components/Common/ToastNotification';

const AddPolicy = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        policyName: '',
        cycle: 'Tháng',
        dueDate: '',
        standardAmount: '24000',
        exemptions: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = { ...formData };
            if (submitData.exemptions) {
               // Verify valid JSON
               JSON.parse(submitData.exemptions);
            }
            const res = await api.post('/fee-policies', submitData);
            if (res.success) {
                toast.success('Tạo chính sách thành công!');
                navigate('/policysettings');
            }
        } catch(error) {
            toast.error(error.message || 'Thiết lập tham số lỗi. File JSON có thể không hợp lệ.');
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h2>Thiết lập chính sách</h2>
                <p>Tạo mới chính sách thu phí cho hệ thống đoàn trực thuộc</p>
            </div>
            
            <div className="policy-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modern">
                        <label>Tên chính sách:</label>
                        <input type="text" required placeholder="VD: Đoàn phí năm học 2024-2025" 
                               value={formData.policyName} onChange={e => setFormData({...formData, policyName: e.target.value})} />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group-modern" style={{flex: 1}}>
                            <label>Chu kỳ nộp:</label>
                            <select required value={formData.cycle} onChange={e => setFormData({...formData, cycle: e.target.value})}>
                                <option value="Tháng">Hàng tháng</option>
                                <option value="Học kỳ">Theo học kỳ</option>
                                <option value="Năm">Hàng năm</option>
                            </select>
                        </div>
                        <div className="form-group-modern" style={{flex: 1}}>
                            <label>Mức thu chuẩn (VNĐ):</label>
                            <input type="number" required 
                                   value={formData.standardAmount} onChange={e => setFormData({...formData, standardAmount: e.target.value})} />
                        </div>
                    </div>

                    <div className="form-group-modern">
                        <label>Trường hợp giảm trừ (Cú pháp JSON):</label>
                        <textarea placeholder={`{ "BCH Chi đoàn": 12000, "BCH Khoa": 24000 }`} rows="4" 
                                  value={formData.exemptions} onChange={e => setFormData({...formData, exemptions: e.target.value})}></textarea>
                    </div>

                    <div className="form-group-modern">
                        <label>Hạn nộp đầu tiên:</label>
                        <input type="date" required 
                               value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                    </div>

                    <div className="form-actions-modern">
                        <Link to="/policysettings" className="btn-back-modern">Quay lại</Link>
                        <button type="submit" className="btn-save">Hoàn thành & Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPolicy;
