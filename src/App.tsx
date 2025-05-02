import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import DashboardPage from './pages/DashboardPage';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Otpcheck from './components/auth/Otpcheck';
<<<<<<< Updated upstream
import { ThemeProvider } from './contexts/ThemeContext';
=======
import { AuthProvider } from './contexts/AuthContext';
import UserManagement from './pages/UserManagement';
import ManagerApprovals from './pages/ManagerApprovals';
import { DarkModeProvider } from './contexts/DarkModeContext';
>>>>>>> Stashed changes

function App() {
  const location = useLocation();

  return (
<<<<<<< Updated upstream
    <ThemeProvider>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="event/:id" element={<EventDetailsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/otpchecking" element={<Otpcheck/>} />
        </Route>
      </Routes>
    </AnimatePresence>
    </ThemeProvider>
=======
    <AuthProvider>
      <DarkModeProvider>
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
              
              {/* Your other existing dashboard routes would go here */}
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
      </DarkModeProvider>
    </AuthProvider>
>>>>>>> Stashed changes
  );
}

export default App;