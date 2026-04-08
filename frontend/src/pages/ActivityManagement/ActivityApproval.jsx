import { Link } from 'react-router-dom';
import { useToast } from '../../components/Common/ToastNotification';

const ActivityApproval = () => {
    const { toast } = useToast();

    return (
        <div className="container">
            <div className="page-header">
                <h2>Phê duyệt Đề xuất Hoạt động</h2>
                <p>Xem xét kế hoạch hoạt động và dự trù kinh phí được đệ trình từ cơ sở.</p>
            </div>
            
            <div className="data-table-card">
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Đơn vị trình</th>
                                <th>Tên chương trình</th>
                                <th>Kinh phí</th>
                                <th>Trợ thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{fontWeight: '600', color: '#0f172a'}}>Chi đoàn K72E1</td>
                                <td>Đại hội Chi đoàn</td>
                                <td style={{fontWeight: '600', color: '#0284c7'}}>500.000 đ</td>
                                <td><span className="status-badge" style={{background: '#fef3c7', color: '#d97706'}}>Đang chờ duyệt</span></td>
                                <td>
                                    <div className="btn-actions">
                                        <button className="btn-activate" onClick={() => toast.success('Đã thay đổi trạng thái thành ĐƯỢC DUYỆT!')}><i className="ri-check-line"></i> Duyệt</button>
                                        <button className="btn-delete" onClick={() => toast.error('Đã TỪ CHỐI đề xuất này!')}><i className="ri-close-line"></i> Từ chối</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
                    <Link to="/activitymanagement" className="btn-modern-outline" style={{width: 'auto'}}><i className="ri-arrow-left-line"></i> Quay về</Link>
                </div>
            </div>
        </div>
    );
};

export default ActivityApproval;
