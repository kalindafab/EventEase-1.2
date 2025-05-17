import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();

  // Show Navbar and Footer for all routes except '/dashboard' and '/Signup'
  const showNavbar = location.pathname !== '/dashboard' && location.pathname !== '/dashboard/users' && location.pathname !== '/dashboard/approvals'&& location.pathname !== '/dashboard/createEvents' && location.pathname !== '/dashboard/attendees' && location.pathname !== '/dashboard/myEvents';
  const showFooter = location.pathname !== '/Signup'  && location.pathname !== '/Login'  && location.pathname !== '/otpchecking'&& location.pathname !== '/dashboard'  && location.pathname !== '/dashboard/users' && location.pathname !== '/dashboard/approvals'  && location.pathname !== '/dashboard/createEvents' &&location.pathname !== '/dashboard/attendees' && location.pathname !== '/dashboard/myEvents';

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
