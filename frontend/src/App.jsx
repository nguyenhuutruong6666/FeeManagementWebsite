import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Members from './pages/Members/Members';
import Users from './pages/Users/Users';
import Profile from './pages/Profile/Profile';
import Units from './pages/Units/Units';
import PolicySettings from './pages/PolicySettings/PolicySettings';
import PayFee from './pages/PayFee/PayFee';
import ManageTransactions from './pages/ManageTransactions/ManageTransactions';
import FeeCashbookSummary from './pages/FeeCashbookSummary/FeeCashbookSummary';
import ActivityManagement from './pages/ActivityManagement/ActivityManagement';
import ReportSummary from './pages/ReportSummary/ReportSummary';
import GenerateFeeObligation from './pages/GenerateFeeObligation/GenerateFeeObligation';

// Forms and Sub-pages
import AddUser from './pages/Users/AddUser';
import EditUser from './pages/Users/EditUser';
import ImportUsers from './pages/Users/ImportUsers';
import AddUnit from './pages/Units/AddUnit';
import EditUnit from './pages/Units/EditUnit';
import ForgotPassword from './pages/Login/ForgotPassword';
import ChangePassword from './pages/Profile/ChangePassword';
import AddPolicy from './pages/PolicySettings/AddPolicy';
import AllocateTransfer from './pages/FeeCashbookSummary/AllocateTransfer';
import ApproveFeePeriod from './pages/FeeCashbookSummary/ApproveFeePeriod';
import ConfirmCashPayment from './pages/PayFee/ConfirmCashPayment';
import RemindDebtors from './pages/PayFee/RemindDebtors';
import ActivityProposal from './pages/ActivityManagement/ActivityProposal';
import ActivityApproval from './pages/ActivityManagement/ActivityApproval';
import Disbursement from './pages/ActivityManagement/Disbursement';

const TitleUpdater = () => {
    const location = useLocation();
    
    useEffect(() => {
        const path = location.pathname;
        let title = 'Hệ thống Quản lý Đoàn phí';
        
        if (path === '/') title = 'Trang chủ';
        else if (path.includes('/login')) title = 'Đăng nhập';
        else if (path.includes('/forgotpassword')) title = 'Quên mật khẩu';
        else if (path.includes('/profile')) title = 'Hồ sơ cá nhân';
        else if (path.includes('/users')) title = 'Quản lý người dùng';
        else if (path.includes('/members')) title = 'Quản lý đoàn viên';
        else if (path.includes('/units')) title = 'Cấu hình tổ chức';
        else if (path.includes('/policysettings')) title = 'Chính sách đoàn phí';
        else if (path.includes('/payfee')) title = 'Nộp đoàn phí';
        else if (path.includes('/managetransactions')) title = 'Giao dịch liên ngân hàng';
        else if (path.includes('/feecashbooksummary')) title = 'Quản lý sổ quỹ';
        else if (path.includes('/activitymanagement')) title = 'Quản lý hoạt động';
        else if (path.includes('/reportsummary')) title = 'Thống kê báo cáo';
        else if (path.includes('/generatefeeobligation')) title = 'Sinh nghĩa vụ';
        
        if (title !== 'Hệ thống Quản lý Đoàn phí') {
            document.title = `${title} | Quản lý Đoàn phí`;
        } else {
            document.title = title;
        }
    }, [location]);
    
    return null;
};

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (requiredRoles && user.isAdmin !== 1 && !requiredRoles.includes(user.roleName)) {
      return <Navigate to="/" replace />; // fallback to dashboard if not allowed
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Dashboard available to all logged in */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Settings / System / Admin */}
        <Route path="/users" element={<ProtectedRoute requiredRoles={[]}><Users /></ProtectedRoute>} />
        <Route path="/users/add" element={<ProtectedRoute requiredRoles={[]}><AddUser /></ProtectedRoute>} />
        <Route path="/users/edit/:id" element={<ProtectedRoute requiredRoles={[]}><EditUser /></ProtectedRoute>} />
        <Route path="/users/import" element={<ProtectedRoute requiredRoles={[]}><ImportUsers /></ProtectedRoute>} />
        
        {/* BCH roles & Admin */}
        <Route path="/members" element={<ProtectedRoute requiredRoles={['BCH Trường', 'BCH Khoa', 'BCH Chi đoàn']}><Members /></ProtectedRoute>} />
        
        {/* Available to all logged in */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/changepassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        
        {/* Real routed components */}
        <Route path="/units" element={<ProtectedRoute requiredRoles={[]}><Units /></ProtectedRoute>} />
        <Route path="/units/add" element={<ProtectedRoute requiredRoles={[]}><AddUnit /></ProtectedRoute>} />
        <Route path="/units/edit/:id" element={<ProtectedRoute requiredRoles={[]}><EditUnit /></ProtectedRoute>} />
        
        <Route path="/policysettings" element={<ProtectedRoute requiredRoles={[]}><PolicySettings /></ProtectedRoute>} />
        <Route path="/policysettings/add" element={<ProtectedRoute requiredRoles={[]}><AddPolicy /></ProtectedRoute>} />
        
        <Route path="/payfee" element={<ProtectedRoute><PayFee /></ProtectedRoute>} />
        <Route path="/payfee/confirm" element={<ProtectedRoute><ConfirmCashPayment /></ProtectedRoute>} />
        <Route path="/payfee/remind" element={<ProtectedRoute><RemindDebtors /></ProtectedRoute>} />
        
        <Route path="/managetransactions" element={<ProtectedRoute><ManageTransactions /></ProtectedRoute>} />
        
        <Route path="/feecashbooksummary" element={<ProtectedRoute><FeeCashbookSummary /></ProtectedRoute>} />
        <Route path="/feecashbooksummary/transfer" element={<ProtectedRoute><AllocateTransfer /></ProtectedRoute>} />
        <Route path="/feecashbooksummary/approve" element={<ProtectedRoute><ApproveFeePeriod /></ProtectedRoute>} />
        
        <Route path="/activitymanagement" element={<ProtectedRoute><ActivityManagement /></ProtectedRoute>} />
        <Route path="/activitymanagement/proposal" element={<ProtectedRoute><ActivityProposal /></ProtectedRoute>} />
        <Route path="/activitymanagement/approval" element={<ProtectedRoute><ActivityApproval /></ProtectedRoute>} />
        <Route path="/activitymanagement/disbursement" element={<ProtectedRoute><Disbursement /></ProtectedRoute>} />
        
        <Route path="/reportsummary" element={<ProtectedRoute><ReportSummary /></ProtectedRoute>} />
        <Route path="/generatefeeobligation" element={<ProtectedRoute requiredRoles={[]}><GenerateFeeObligation /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
