import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Units.scss';

const Units = () => {
    const { user } = useAuthStore();
    const [units, setUnits] = useState([]);

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
            }
        };
        fetchTree();
    }, []);

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
                {iconBrand(node.brand)} <b>{node.unit_title}</b> <span style={{color: 'gray'}}>({node.brand})</span>
                
                {node.brand === "Trường" && (
                    <Link className="btn-small green" to={`/units/add?brand=Khoa&parent_ub_id=${node.ub_id}`}>Thêm Khoa</Link>
                )}
                {node.brand === "Khoa" && (
                    <Link className="btn-small blue" to={`/units/add?brand=Chi%20đoàn&parent_ub_id=${node.ub_id}`}>Thêm Chi đoàn</Link>
                )}
                
                <Link className="btn-small orange" to={`/units/edit/${node.ub_id}`}>Sửa</Link>
                <a className="btn-small red" href="#" onClick={(e) => { e.preventDefault(); alert('Xóa'); }}>Xóa</a>
                
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
            <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Cấu hình tổ chức</h2>
            <div className="actions" style={{marginBottom: '20px'}}>
                <Link to="/units/add?brand=Trường" className="btn-add">Thêm Trường</Link>
            </div>
            <div className="tree-container">
                <ul>
                    {units.map(u => renderNode(u))}
                </ul>
            </div>
        </div>
    );
};

export default Units;
