import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Units.scss';
import { useToast } from '../../components/Common/ToastNotification';

const Units = () => {
    const { user } = useAuthStore();
    const [units, setUnits] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
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
                    data.forEach(node => {
                        if (node.parentUnitId) {
                            if (map[node.parentUnitId]) {
                                map[node.parentUnitId].children.push(node);
                            }
                        } else {
                            roots.push(node);
                        }
                    });
                    
                    setUnits(roots);
                }
            } catch(e) {
                console.error(e);
                toast.error("Lỗi khi tải cấu trúc tổ chức");
            }
        };
        fetchTree();
    }, [toast]);

    const iconBrand = (brand) => {
        const b = brand.toLowerCase();
        if (b === "trường" || b === "truong") return "🏫";
        if (b === "khoa") return "🏢";
        if (b === "chi đoàn" || b === "chi doan" || b === "chidoan") return "👥";
        return "📁";
    };

    const renderNode = (node) => {
        return (
            <li key={node.ub_id}>
                <div className="node-content">
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
                        <a className="btn-delete-unit" href="#" onClick={(e) => { e.preventDefault(); toast.info('Chức năng xóa đơn vị đang phát triển.'); }}>Xóa</a>
                    </div>
                </div>
                
                {node.children && node.children.length > 0 && (
                    <ul>
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
        </div>
    );
};

export default Units;
