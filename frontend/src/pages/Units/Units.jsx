import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import './Units.scss';

// Note: In a real implementation this would fetch from /api/units tree
const Units = () => {
    const { user } = useAuthStore();
    const [units, setUnits] = useState([]);

    useEffect(() => {
        // Mock data structure representing units matching the backend payload
        setUnits([
            {
                ub_id: 1, unit_id: 1, unit_title: 'ĐH Sư phạm', brand: 'Trường',
                children: [
                    { ub_id: 2, unit_id: 2, unit_title: 'CNTT', brand: 'Khoa', children: [
                        { ub_id: 3, unit_id: 3, unit_title: 'K72E1', brand: 'Chi đoàn' }
                    ]}
                ]
            }
        ]);
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
