import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import DashboardPage from './pages/DashboardPage';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Otpcheck from './components/auth/Otpcheck';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const location = useLocation();

  return (
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
  );
}

export default App;