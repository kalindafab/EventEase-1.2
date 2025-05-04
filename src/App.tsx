import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import DashboardPage from './pages/DashboardPage';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Otpcheck from './components/auth/Otpcheck';
import { AuthProvider } from './contexts/AuthContext';
import UserManagement from './pages/UserManagement';
import ManagerApprovals from './pages/ManagerApprovals';
import CreateEventPage from './pages/CreateEventPage';
import AttendeesPage from './pages/AttendeesPage';
import MyEvents from './pages/MyEvents';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="event/:id" element={<EventDetailsPage />} />
            
            {/* Auth routes */}
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/otpchecking" element={<Otpcheck/>} />
            
            {/* Dashboard routes - uses DashboardPage layout */}
            <Route path="dashboard" element={<DashboardPage />}>
              {/* Admin sections */}
              <Route path="users" element={<UserManagement />} />
              <Route path="approvals" element={<ManagerApprovals />} />
              {/* manager sections */}
              <Route path="createEvents" element={<CreateEventPage />} />
              <Route path="attendees" element={<AttendeesPage />} />
              <Route path="myEvents" element={<MyEvents />} />
              
              {/* Your other existing dashboard routes would go here */}
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </AuthProvider>
    
  );
}

export default App;