import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share, 
  Heart, 
  Ticket, 
  CalendarPlus,
  ArrowLeft 
} from 'lucide-react';
import { eventsData, Event } from '../data/eventsData';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    // Simulate loading from an API
    const timer = setTimeout(() => {
      const foundEvent = eventsData.find(e => e.id === id);
      setEvent(foundEvent || null);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading event details...</p>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-primary-900 h-64 md:h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-primary-900/50"></div>
        </div>
        
        <div className="container-custom relative z-10 h-full flex flex-col justify-end pb-8">
          <Link to="/" className="text-white/80 hover:text-white flex items-center mb-4 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to events
          </Link>
          
          <div className="bg-primary-500 text-white inline-block px-3 py-1 rounded-full text-sm font-medium mb-4">
            {event.category}
          </div>
          
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {event.title}
          </motion.h1>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center text-white/90">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(event.date)}
            </div>
            
            <div className="flex items-center text-white/90">
              <Clock className="h-5 w-5 mr-2" />
              {event.time}
            </div>
            
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              {event.location}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Event Details */}
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <motion.button
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                onClick={toggleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Saved' : 'Save'}
              </motion.button>
              
              <motion.button
                className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                onClick={shareEvent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share className="h-5 w-5 mr-2" />
                Share
              </motion.button>
              
              <motion.button
                className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CalendarPlus className="h-5 w-5 mr-2" />
                Add to Calendar
              </motion.button>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Organizer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center">
                <img 
                  src={event.organizer.logo} 
                  alt={event.organizer.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{event.organizer.name}</h3>
                  <p className="text-gray-600">Event Organizer</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Ticket Info */}
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">

                  {event.price === 0 ? 'Free' : `${event.price} Frw`}

                </h3>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <Users className="h-5 w-5 mr-2 text-primary-500" />
                  {event.attendees} people attending
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Date and Time</p>
                      <p className="text-gray-600">
                        {formatDate(event.date)}
                        <br />
                        {event.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  className="btn-primary w-full flex items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Ticket className="h-5 w-5 mr-2" />
                  Get Tickets
                </motion.button>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-2">Share with friends</h4>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.5 6.75a.75.75 0 1 1 .75.75.75.75 0 0 1-.75-.75zm-9 0a.75.75 0 1 1 .75.75.75.75 0 0 1-.75-.75zM12 18.75a6.752 6.752 0 0 1-6.75-6.75.75.75 0 0 1 1.5 0 5.25 5.25 0 1 0 10.5 0 .75.75 0 0 1 1.5 0 6.752 6.752 0 0 1-6.75 6.75z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;