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
  MessageSquare
} from 'lucide-react';

interface SidebarItemProps {
  // Updated styles for light and dark mode

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

const DashboardSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, text: 'Dashboard', to: '/dashboard' },
    { icon: <Calendar className="h-5 w-5" />, text: 'My Events', to: '/dashboard/events' },
    { icon: <PlusCircle className="h-5 w-5" />, text: 'Create Event', to: '/dashboard/create' },
    { icon: <Bookmark className="h-5 w-5" />, text: 'Saved Events', to: '/dashboard/saved' },
    { icon: <Users className="h-5 w-5" />, text: 'Attendees', to: '/dashboard/attendees' },
    { icon: <MessageSquare className="h-5 w-5" />, text: 'Messages', to: '/dashboard/messages' },
    { icon: <MessageSquare className="h-5 w-5" />, text: 'Messages', to: '/dashboard/messages' },
    { icon: <MessageSquare className="h-5 w-5" />, text: 'Messages', to: '/dashboard/messages' },
    { icon: <Settings className="h-5 w-5" />, text: 'Settings', to: '/dashboard/settings' },
  ];
  
  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-7 w-7 text-primary-500" />
          <span className="text-xl font-bold text-primary-800">EventEase 1.2</span>
        </Link>
      </div>
      
      <div className="px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              text={item.text}
              to={item.to}
              isActive={pathname === item.to}
            />
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-6">
        <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors w-full">
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;