import { Link } from 'react-router-dom';
import { Calendar, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-primary-800">EventEase</span>
            </Link>
            <p className="text-gray-600 max-w-xs">
              Discover and attend the most exciting events happening around you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Music
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Tech
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Food & Drinks
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Sports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Arts & Theatre
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Contact</h4>
            <div className="space-y-4">
              <p className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2 text-primary-500" />
                support@eventease.com
              </p>
              <div>
                <button className="btn-primary">
                  Subscribe to Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EventEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;