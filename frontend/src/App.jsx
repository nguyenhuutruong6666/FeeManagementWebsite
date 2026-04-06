import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
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
        <Route path="/profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        
        {/* Real routed components */}
        <Route path="/units" element={<ProtectedRoute requiredRoles={[]}><Units /></ProtectedRoute>} />
        <Route path="/units/add" element={<ProtectedRoute requiredRoles={[]}><AddUnit /></ProtectedRoute>} />
        <Route path="/units/edit/:id" element={<ProtectedRoute requiredRoles={[]}><EditUnit /></ProtectedRoute>} />
        
        <Route path="/policy-settings" element={<ProtectedRoute requiredRoles={[]}><PolicySettings /></ProtectedRoute>} />
        <Route path="/policy-settings/add" element={<ProtectedRoute requiredRoles={[]}><AddPolicy /></ProtectedRoute>} />
        
        <Route path="/pay-fee" element={<ProtectedRoute><PayFee /></ProtectedRoute>} />
        <Route path="/pay-fee/confirm" element={<ProtectedRoute><ConfirmCashPayment /></ProtectedRoute>} />
        <Route path="/pay-fee/remind" element={<ProtectedRoute><RemindDebtors /></ProtectedRoute>} />
        
        <Route path="/manage-transactions" element={<ProtectedRoute><ManageTransactions /></ProtectedRoute>} />
        
        <Route path="/fee-cashbook-summary" element={<ProtectedRoute><FeeCashbookSummary /></ProtectedRoute>} />
        <Route path="/fee-cashbook-summary/transfer" element={<ProtectedRoute><AllocateTransfer /></ProtectedRoute>} />
        <Route path="/fee-cashbook-summary/approve" element={<ProtectedRoute><ApproveFeePeriod /></ProtectedRoute>} />
        
        <Route path="/activity-management" element={<ProtectedRoute><ActivityManagement /></ProtectedRoute>} />
        <Route path="/activity-management/proposal" element={<ProtectedRoute><ActivityProposal /></ProtectedRoute>} />
        <Route path="/activity-management/approval" element={<ProtectedRoute><ActivityApproval /></ProtectedRoute>} />
        <Route path="/activity-management/disbursement" element={<ProtectedRoute><Disbursement /></ProtectedRoute>} />
        
        <Route path="/report-summary" element={<ProtectedRoute><ReportSummary /></ProtectedRoute>} />
        <Route path="/generate-fee-obligation" element={<ProtectedRoute requiredRoles={[]}><GenerateFeeObligation /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
