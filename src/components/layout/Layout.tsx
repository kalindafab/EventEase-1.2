import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();

  // Hide Navbar/Footer on dashboard and buy-ticket routes
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isBuyTicketRoute = location.pathname.startsWith('/buy-ticket');

  // Optionally hide on some auth routes too
  const hideFooterRoutes = ['/Signup', '/Login', '/otpchecking'];

  const showNavbar = !isDashboardRoute && !isBuyTicketRoute;
  const showFooter = !isDashboardRoute && !isBuyTicketRoute && !hideFooterRoutes.includes(location.pathname);

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
