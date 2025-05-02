import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Search
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UpcomingEventCard from '../components/dashboard/UpcomingEventCard';
import StatCard from '../components/dashboard/StatCard';
import { eventsData } from '../data/eventsData';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Search functionality is handled through the filtered content
    }
  };

  // Filter content based on search term
  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingEvents = searchTerm ? filteredEvents.slice(0, 3) : eventsData.slice(0, 3);

  // Check if we're on a nested route (users/approvals)
  const isNestedRoute = location.pathname.includes('/dashboard/users') || 
                       location.pathname.includes('/dashboard/approvals');

  // Show search results or default content
  const showSearchResults = searchTerm.trim() && !isNestedRoute;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div 
        className={`w-64 fixed md:static z-30 h-full transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-200 ease-in-out`}
        initial={false}
      >
        <DashboardSidebar />
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleKeyUp={handleKeyUp}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {isNestedRoute ? (
            <Outlet />
          ) : showSearchResults ? (
            // Search Results View
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Search Results for "{searchTerm}"
                </h2>
                <button 
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              </div>
              
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <UpcomingEventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-gray-500">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Default Dashboard Content
            <>
              <div className="mb-6">
                <motion.h1 
                  className="text-2xl font-bold mb-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Welcome back, Luvumbu
                </motion.h1>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Here's what's happening with your events today.
                </motion.p>
              </div>
              
              {/* Stats */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StatCard
                  title="Total Attendees"
                  value="1,248"
                  icon={<Users size={24} className="text-primary-600" />}
                  change={{ value: 12, isPositive: true }}
                  bgColor="bg-primary-50"
                  textColor="text-primary-900"
                />
                
                <StatCard
                  title="Upcoming Events"
                  value="8"
                  icon={<Calendar size={24} className="text-indigo-600" />}
                  change={{ value: 4, isPositive: true }}
                  bgColor="bg-indigo-50"
                  textColor="text-indigo-900"
                />
                
                <StatCard
                  title="Total Revenue"
                  value="$8,492"
                  icon={<CreditCard size={24} className="text-green-600" />}
                  change={{ value: 8, isPositive: true }}
                  bgColor="bg-green-50"
                  textColor="text-green-900"
                />
                
                <StatCard
                  title="Event Engagement"
                  value="82%"
                  icon={<TrendingUp size={24} className="text-amber-600" />}
                  change={{ value: 3, isPositive: false }}
                  bgColor="bg-amber-50"
                  textColor="text-amber-900"
                />
              </motion.div>
              
              {/* Charts and Upcoming Events */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Activity Chart */}
                <motion.div 
                  className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Activity Overview</h2>
                    <select className="bg-gray-100 border-0 rounded-lg p-2 text-sm focus:outline-none">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-6 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Event Registrations</p>
                        <span className="flex items-center text-sm font-medium text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          +28%
                        </span>
                      </div>
                      <p className="text-2xl font-bold">482</p>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Event Views</p>
                        <span className="flex items-center text-sm font-medium text-red-600">
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                          -12%
                        </span>
                      </div>
                      <p className="text-2xl font-bold">1,749</p>
                    </div>
                  </div>
                  
                  {/* Simple Chart Mockup */}
                  <div className="h-60 mt-8">
                    <div className="w-full h-full bg-gradient-to-t from-primary-100 to-transparent relative rounded-lg overflow-hidden">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="absolute bottom-0 flex flex-col items-center" style={{ left: `${i * 15 + 5}%` }}>
                          <div 
                            className="bg-primary-500 rounded-full w-2.5 h-2.5 mb-1"
                            style={{ 
                              height: `${Math.floor(Math.random() * 60) + 20}%`,
                              width: '8px',
                              borderRadius: '4px' 
                            }}
                          ></div>
                          <span className="text-xs text-gray-500">
                            {new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Upcoming Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Upcoming Events</h2>
                    <Link to="/dashboard/events" className="text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center">
                      View all <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <UpcomingEventCard key={event.id} event={event} />
                    ))}
                  </div>
                </motion.div>
              </div>
              
              {/* Recent Activity */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <button className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                    View all
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Activity Item */}
                  <div className="flex items-start pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Registration</p>
                      <p className="text-sm text-gray-600">John Doe registered for "TechConnect Conference 2025"</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  {/* Activity Item */}
                  <div className="flex items-start pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-sm text-gray-600">You received $299 for "Summer Music Festival" ticket</p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                    </div>
                  </div>
                  
                  {/* Activity Item */}
                  <div className="flex items-start pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Event Update</p>
                      <p className="text-sm text-gray-600">You updated the details for "Photography Workshop"</p>
                      <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                    </div>
                  </div>
                  
                  {/* Activity Item */}
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Milestone Reached</p>
                      <p className="text-sm text-gray-600">"TechConnect Conference 2025" reached 1,000 registrations</p>
                      <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;