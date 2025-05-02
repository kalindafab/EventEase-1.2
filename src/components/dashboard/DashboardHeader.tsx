import { useState } from 'react';
import { Bell, Search, Menu, X, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const DashboardHeader = ({ toggleSidebar, isSidebarOpen }: DashboardHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4">
      <button 
      className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none md:hidden"
      onClick={toggleSidebar}
      aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
      {isSidebarOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
      </button>
      
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 w-64 mr-auto">
      <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 dark:text-gray-300"
      />
      </div>
      
      <div className="flex items-center gap-4">
      <ThemeToggle />
      
      <div className="relative">
        <button 
        className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
        >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <AnimatePresence>
        {showNotifications && (
          <motion.div 
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          >
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500">
              Mark all as read
            </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              </div>
              <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">New Event Registration: </span>
                John Doe registered for "TechConnect Conference 2025"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            </div>
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              </div>
              <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">New Message: </span>
                Sarah Miller sent you a message about her registration
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>
            </div>
            
            <div className="p-4">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              </div>
              <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">Reminder: </span>
                "Summer Music Festival" is happening in 3 days
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>
            </div>
          </div>
          
          <div className="p-3 text-center border-t border-gray-100 dark:border-gray-700">
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500">
            View all notifications
            </button>
          </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      
      <div className="relative ml-4">
        <button 
        className="flex items-center"
        onClick={() => setShowUserMenu(!showUserMenu)}
        aria-label="User menu"
        >
        <div className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-center mr-2 overflow-hidden">
          <img 
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="User"
          className="h-full w-full object-cover"
          />
        </div>
        <span className="font-medium text-gray-700 dark:text-gray-300 hidden md:block">Luvumbu Nzinga</span>
        </button>
        
        <AnimatePresence>
        {showUserMenu && (
          <motion.div 
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          >
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="font-medium text-gray-800 dark:text-gray-200">Luvumbu Nzinga</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">luvumbu43@gmail.com</p>
          </div>
          
          <div>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-white">
            Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-white">
            Settings
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700 text-red-600">
            Log out
            </button>
          </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      </div>
    </header>
  );
};

export default DashboardHeader;