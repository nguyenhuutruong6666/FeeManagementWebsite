import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <Sidebar />
            {/* The main content area just maps directly into the body like the old architecture */}
            {children}
        </>
    );
};

export default Layout;
