import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Zap, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/ui/SearchBar';
import CategoryFilter from '../components/ui/CategoryFilter';

interface ApiEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  organizerName: string;
  imageUrl?: string;
  isFeatured?: boolean;
  attendees?: number;
  price?: number;
}

const HomePage = () => {
  const [apiEvents, setApiEvents] = useState<ApiEvent[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<ApiEvent | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get<ApiEvent[]>('http://localhost:5297/api/Event/allEvents');
        const withImages = await Promise.all(response.data.map(async (event) => {
          try {
            const imgRes = await axios.get(`http://localhost:5297/api/Event/get-image/${event.id}`, {
              responseType: 'blob'
            });
            const imageUrl = URL.createObjectURL(imgRes.data);
            return { ...event, imageUrl };
          } catch {
            return event;
          }
        }));
        
        setApiEvents(withImages);
        
        const featured = withImages.find(event => event.isFeatured) || withImages[0];
        if (featured) {
          setFeaturedEvent(featured);
        }
      } catch (err) {
        setError('Failed to fetch events');
        console.error('Failed to fetch events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  const categories = ['All', ...Array.from(new Set(apiEvents.map(event => event.category)))];

  const getFilteredEvents = () => {
    return apiEvents
      .filter(event => activeCategory === 'All' || event.category === activeCategory)
      .map(event => ({
        ...event,
        shortDescription: event.description.length > 100 
          ? event.description.substring(0, 100) + '...' 
          : event.description
      }));
  };

  const handleSearch = (query: string, location: string, date: string) => {
    let filtered = [...apiEvents];
    
    if (query) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (location) {
      filtered = filtered.filter(event => 
        event.venue.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (date) {
      filtered = filtered.filter(event => 
        event.date.includes(date)
      );
    }
    
    setApiEvents(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  const filteredEvents = getFilteredEvents();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-primary-900 dark:bg-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-900/95 dark:from-gray-900/90 dark:to-gray-900"></div>
        </div>
        
        <div className="container-custom relative z-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Amazing Events Near You
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Find and attend events that match your interests, connect with like-minded people, and create lasting memories.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/dashboard" 
                className="btn-primary text-lg"
              >
                Explore Events
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="w-full max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>
      
      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div 
              className="flex flex-col md:flex-row gap-8 overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg cursor-pointer"
              onClick={() => handleEventClick(featuredEvent.id)}
            >
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {featuredEvent.imageUrl && (
                  <img 
                    src={featuredEvent.imageUrl} 
                    alt={featuredEvent.name} 
                    className="w-full h-64 md:h-full object-cover"
                  />
                )}
              </motion.div>
              
              <motion.div 
                className="md:w-1/2 p-6 md:p-8 flex flex-col"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Featured Event
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {featuredEvent.name}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {featuredEvent.description.length > 150 
                    ? featuredEvent.description.substring(0, 150) + '...' 
                    : featuredEvent.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400" />
                    {new Date(featuredEvent.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400" />
                    {featuredEvent.venue}
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-5 w-5 mr-3 text-primary-500 dark:text-primary-400" />
                    {featuredEvent.attendees || 0} people attending
                  </div>
                </div>
                
                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(featuredEvent.id);
                      }}
                      className="btn-primary w-full md:w-auto flex justify-center"
                    >
                      View Details
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
      
      {/* Events Section */}
      <section className="py-12 md:py-16 dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 dark:text-white">Upcoming Events</h2>
              <p className="text-gray-600 dark:text-gray-400">Discover and book your next experience</p>
            </div>
            
            <Link to="/dashboard" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors mt-4 md:mt-0">
              View All Events
            </Link>
          </div>
          
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="cursor-pointer"
              >
                <EventCard 
                  event={{
                    id: event.id,
                    title: event.name,
                    description: event.description,
                    shortDescription: event.shortDescription,
                    date: event.date,
                    time: event.time,
                    location: event.venue,
                    category: event.category,
                    image: event.imageUrl || 'https://via.placeholder.com/400x200',
                    isFeatured: event.isFeatured || false,
                    attendees: event.attendees || 0,
                    price: event.price || 0,
                    organizer: event.organizerName
                  }}
                  index={index} 
                />
              </div>
            ))}
          </motion.div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary-50 dark:bg-gray-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Ready to Create Your Own Event?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Share your passion, build a community, and create unforgettable experiences.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/dashboard" 
                className="btn-primary text-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;