import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle,
  Bookmark,
  MessageSquare,
  UserCog,
  ShieldQuestion
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, text, to, isActive }: SidebarItemProps) => {
  return (
    <Link to={to} className="block">
      <motion.div 
        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary-100 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100'
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
            className="ml-auto w-1.5 h-5 bg-primary-500 rounded-full"
            layoutId="sidebar-indicator"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

interface NavItem {
  icon: React.ReactNode;
  text: string;
  to: string;
  permission?: string;
  role?: 'admin' | 'manager' | 'client'; // Explicit role restriction
}

const DashboardSidebar = () => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

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
      to: '/dashboard/events/create',
      permission: 'CanCreateEvents',
      role: 'manager'
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      text: 'Attendees', 
      to: '/dashboard/events/attendees',
      permission: 'CanViewTicketSales',
      role: 'manager'
    },
    { 
      icon: <Calendar className="h-5 w-5" />, 
      text: 'My Events', 
      to: '/dashboard/events',
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

    // Logout (all roles)
    { 
      icon: <LogOut className="h-5 w-5" />, 
      text: 'Logout', 
      to: '/logout',
      permission: 'CanManageProfile'
    }
  ];

  const filteredItems = navItems.filter(item => {
    // Check permission first
    const hasPerm = item.permission ? hasPermission(item.permission) : true;
    
   
    const roleAllowed = item.role 
      ? user?.role === item.role
      : true; 
    
    return hasPerm && roleAllowed;
  });


  console.log('Rendering sidebar for:', {
    role: user?.role,
    permissions: user?.permissions,
    visibleItems: filteredItems.map(i => i.text)
  });

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-7 w-7 text-primary-500" />
          <span className="text-xl font-bold text-primary-800">EventEase 1.2</span>
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
            />
          ))}
        </nav>
      </div>

      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium text-gray-700">
                {user.firstname?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 truncate max-w-[160px]">
                {user.firstname || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
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