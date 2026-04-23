import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Units.scss';
import { useToast } from '../../components/Common/ToastNotification';
import ConfirmModal from '../../components/Common/ConfirmModal';

const Units = () => {
    const { user } = useAuthStore();
    const [units, setUnits] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState({});
    const { toast } = useToast();
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, name: '' });

    const fetchTree = async () => {
        try {
            const res = await api.get('/units/brands');
            if (res.success) {
                const data = res.data.map(item => ({
                    ...item,
                    ub_id: item.id,
                    unit_title: item.unit?.title || '',
                    brand: item.brand?.title || '',
                    children: []
                }));
                
                const map = {};
                data.forEach(node => { map[node.id] = node; });
                
                const roots = [];
                const initialExpanded = {};
                data.forEach(node => {
                    initialExpanded[node.ub_id] = true;
                    if (node.parentUnitId) {
                        if (map[node.parentUnitId]) {
                            map[node.parentUnitId].children.push(node);
                        }
                    } else {
                        roots.push(node);
                    }
                });
                
                setExpandedNodes(initialExpanded);
                setUnits(roots);
            }
        } catch(e) {
            console.error(e);
            toast.error("Lỗi khi tải cấu trúc tổ chức");
        }
    };

    useEffect(() => {
        fetchTree();
    }, [toast]);

    const openDeleteConfirm = (id, name) => {
        setConfirmModal({ isOpen: true, id, name });
    };

    const closeDeleteConfirm = () => {
        setConfirmModal({ isOpen: false, id: null, name: '' });
    };

    const handleDelete = async () => {
        if (!confirmModal.id) return;
        try {
            const res = await api.delete(`/units/brands/${confirmModal.id}`);
            if (res.success) {
                toast.success('Đã xóa đơn vị thành công.');
                fetchTree();
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi xóa.');
        } finally {
            closeDeleteConfirm();
        }
    };

    const toggleExpand = (id) => {
        setExpandedNodes(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const iconBrand = (brand) => {
        const b = brand.toLowerCase();
        if (b === "trường" || b === "truong") return "🏫";
        if (b === "khoa") return "🏢";
        if (b === "chi đoàn" || b === "chi doan" || b === "chidoan") return "👥";
        return "📁";
    };

    const renderNode = (node) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes[node.ub_id];

        return (
            <li key={node.ub_id} className={hasChildren ? 'has-children' : ''}>
                <div className="node-content">
                    {hasChildren ? (
                        <button 
                            className={`toggle-btn ${isExpanded ? 'expanded' : ''}`} 
                            onClick={() => toggleExpand(node.ub_id)}
                            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                        >
                            <i className={isExpanded ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"}></i>
                        </button>
                    ) : (
                        <span className="toggle-placeholder"></span>
                    )}
                    <div className="node-icon">{iconBrand(node.brand)}</div>
                    <span className="node-title">{node.unit_title}</span>
                    <span className="node-brand">{node.brand}</span>
                    
                    <div className="node-actions">
                        {node.brand === "Trường" && (
                            <Link className="btn-add-unit" to={`/units/add?brand=Khoa&parent_ub_id=${node.ub_id}`}>Thêm Khoa</Link>
                        )}
                        {node.brand === "Khoa" && (
                            <Link className="btn-add-unit" to={`/units/add?brand=Chi%20đoàn&parent_ub_id=${node.ub_id}`}>Thêm Chi đoàn</Link>
                        )}
                        <Link className="btn-edit-unit" to={`/units/edit/${node.ub_id}`}>Sửa</Link>
                        <button className="btn-delete-unit" onClick={() => openDeleteConfirm(node.ub_id, node.unit_title)}>Xóa</button>
                    </div>
                </div>
                
                {hasChildren && isExpanded && (
                    <ul className="node-children-list">
                        {node.children.map(child => renderNode(child))}
                    </ul>
                )}
            </li>
        );
    };

    if (user?.isAdmin !== 1) {
        return <div className="container"><p style={{color: 'red'}}>Bạn không có quyền truy cập.</p></div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h2>Cấu hình tổ chức</h2>
                <p>Quản lý biểu đồ phân cấp tổ chức (Trường - Khoa - Chi đoàn)</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <Link to="/units/add?brand=Trường" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', color: 'white' }}>
                    <i className="ri-add-line" style={{ marginRight: '8px' }}></i> Thêm Trường
                </Link>
            </div>

            <div className="tree-card">
                <div className="tree-container">
                    <ul>
                        {units.map(u => renderNode(u))}
                    </ul>
                </div>
            </div>

            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                toggle={closeDeleteConfirm}
                title="Xóa đơn vị tổ chức"
                message={`Bạn có chắc chắn muốn xóa đơn vị: ${confirmModal.name}? Mọi dữ liệu liên quan nếu có sẽ khiến việc xóa thất bại.`}
                onConfirm={handleDelete}
                confirmText="Đồng ý xóa"
                cancelText="Hủy bỏ"
                variant="danger"
            />
        </div>
    );
};

export default Units;
