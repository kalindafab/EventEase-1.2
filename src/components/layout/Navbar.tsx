import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Calendar className="h-8 w-8 text-primary-500" />
            </motion.div>
            <span className="text-xl font-bold text-primary-800">EventEase 1.2</span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium hover:text-primary-600 transition-colors ${
                isCurrentPath('/') ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`font-medium hover:text-primary-600 transition-colors ${
                isCurrentPath('/dashboard') ? 'text-primary-600' : 'text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link 
                 to="/Signup" 
                   className="btn-primary flex items-center justify-center gap-2"
                       >
                       <User className="h-4 w-4" />
                   Sign Up
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-b border-gray-100"
        >
          <div className="container-custom py-4 space-y-4">
            <Link 
              to="/" 
              className={`block py-2 font-medium ${
                isCurrentPath('/') ? 'text-primary-600' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`block py-2 font-medium ${
                isCurrentPath('/dashboard') ? 'text-primary-600' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button className="btn-primary w-full">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;