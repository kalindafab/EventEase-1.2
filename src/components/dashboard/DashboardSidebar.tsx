import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle,
  Bookmark,
  UserCog,
  ShieldQuestion,
  Ticket
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, text, to, isActive, onClick }: SidebarItemProps) => {
  const content = (
    <motion.div 
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mr-3">
        {icon}
      </div>
      <span className="font-medium">{text}</span>
      {isActive && (
        <motion.div 
          className="ml-auto w-1.5 h-5 bg-primary-500 dark:bg-primary-400 rounded-full"
          layoutId="sidebar-indicator"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );

  return to === '/logout' ? (
    <button onClick={onClick} className="block w-full text-left">
      {content}
    </button>
  ) : (
    <Link to={to} className="block">
      {content}
    </Link>
  );
};

interface NavItem {
  icon: React.ReactNode;
  text: string;
  to: string;
  permission?: string;
  role?: 'admin' | 'manager' | 'client';
}

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5297/api/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      logout();
      localStorage.removeItem('token');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  const navItems: NavItem[] = [
    // Common items for all roles
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      text: 'Dashboard', 
      to: '/dashboard',
      permission: 'CanManageProfile'
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      text: 'Settings', 
      to: '/dashboard/settings',
      permission: 'CanManageProfile'
    },

    // Admin-specific items
    {
      icon: <UserCog className="h-5 w-5" />, 
      text: 'User Management',
      to: '/dashboard/users',
      permission: 'CanManageUsers',
      role: 'admin'
    },
    {
      icon: <ShieldQuestion className="h-5 w-5" />, 
      text: 'Approvals',
      to: '/dashboard/approvals',
      permission: 'CanApproveManagers',
      role: 'admin'
    },

    // Manager-specific items
    { 
      icon: <PlusCircle className="h-5 w-5" />, 
      text: 'Create Event', 
      to: '/dashboard/createEvents',
      permission: 'CanCreateEvents',
      role: 'manager'
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      text: 'Attendees', 
      to: '/dashboard/attendees',
      permission: 'CanViewTicketSales',
      role: 'manager'
    },
    { 
      icon: <Calendar className="h-5 w-5" />, 
      text: 'My Events', 
      to: '/dashboard/view-my-events',
      permission: 'CanViewOwnEvents',
      role: 'manager'
    },

    // Client-specific items
    { 
      icon: <Bookmark className="h-5 w-5" />, 
      text: 'Saved Events', 
      to: '/dashboard/saved',
      permission: 'CanBrowseEvents',
      role: 'client'
    },
    { 
      icon: <Calendar className="h-5 w-5" />, 
      text: 'My Tickets', 
      to: '/dashboard/tickets',
      permission: 'CanViewOwnTickets',
      role: 'client'
    },
    { 
      icon: <Ticket className="h-5 w-5" />, 
      text: 'Upcoming Events', 
      to: '/dashboard/AllEvents',
      permission: 'CanViewAllEvents',
      role: 'client'
    },

    // Logout (all roles)
    { 
      icon: <LogOut className="h-5 w-5" />, 
      text: 'Logout', 
      to: '/logout',
      permission: 'CanManageProfile'
    }
  ];

  const filteredItems = navItems.filter(item => {
    return item.permission ? hasPermission(item.permission) : true;
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-7 w-7 text-primary-500 dark:text-primary-400" />
          <span className="text-xl font-bold text-primary-800 dark:text-primary-300">EventEase 1.2</span>
        </Link>
      </div>
      
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              text={item.text}
              to={item.to}
              isActive={location.pathname.startsWith(item.to)}
              onClick={item.to === '/logout' ? handleLogout : undefined}
            />
          ))}
        </nav>
      </div>

      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {user.firstname?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                {user.firstname || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.role || 'Unknown role'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;